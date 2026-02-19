import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - List all resources
export async function GET() {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resources: data });
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

// POST - Add a new resource
export async function POST(request: NextRequest) {
  try {
    const { title, url, description, category } = await request.json();

    if (!title || !url || !description || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Extract domain from URL
    let domain: string;
    try {
      domain = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("resources")
      .insert({
        title,
        url,
        domain,
        description,
        category,
        favicon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Resource with this URL already exists" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resource: data });
  } catch (error) {
    console.error("Failed to add resource:", error);
    return NextResponse.json({ error: "Failed to add resource" }, { status: 500 });
  }
}

// DELETE - Remove a resource
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
