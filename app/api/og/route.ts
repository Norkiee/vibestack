import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabaseAdmin = getSupabaseAdmin();

    // Check if we have cached OG data
    const { data: existing } = await supabaseAdmin
      .from("resources")
      .select("og_image_url, favicon_url, og_fetched_at")
      .eq("url", url)
      .single();

    // Return cached data if still fresh
    if (existing?.og_fetched_at) {
      const fetchedAt = new Date(existing.og_fetched_at).getTime();
      const now = Date.now();
      if (now - fetchedAt < THIRTY_DAYS_MS) {
        return NextResponse.json({
          og_image_url: existing.og_image_url,
          favicon_url: existing.favicon_url,
          cached: true,
        });
      }
    }

    // Fetch from Microlink
    const domain = new URL(url).hostname.replace(/^www\./, "");
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

    const res = await fetch(microlinkUrl);
    const data = await res.json();

    const ogImage = data?.data?.image?.url || data?.data?.logo?.url || null;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    // Update the resource with OG data
    await supabaseAdmin
      .from("resources")
      .update({
        og_image_url: ogImage,
        favicon_url: favicon,
        og_fetched_at: new Date().toISOString(),
      })
      .eq("url", url);

    return NextResponse.json({
      og_image_url: ogImage,
      favicon_url: favicon,
      cached: false,
    });
  } catch (error) {
    console.error("OG fetch error:", error);

    // Return fallback favicon on error
    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      return NextResponse.json({
        og_image_url: null,
        favicon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        error: true,
      });
    } catch {
      return NextResponse.json({ error: "Failed to fetch OG data" }, { status: 500 });
    }
  }
}

// Batch update endpoint for seeding OG data
export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: "URLs array required" }, { status: 400 });
    }

    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabaseAdmin = getSupabaseAdmin();

    const results = await Promise.allSettled(
      urls.map(async (url: string) => {
        const domain = new URL(url).hostname.replace(/^www\./, "");
        const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

        try {
          const res = await fetch(microlinkUrl);
          const data = await res.json();

          const ogImage = data?.data?.image?.url || data?.data?.logo?.url || null;
          const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

          await supabaseAdmin
            .from("resources")
            .update({
              og_image_url: ogImage,
              favicon_url: favicon,
              og_fetched_at: new Date().toISOString(),
            })
            .eq("url", url);

          return { url, success: true };
        } catch {
          return { url, success: false };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Batch OG fetch error:", error);
    return NextResponse.json({ error: "Batch fetch failed" }, { status: 500 });
  }
}
