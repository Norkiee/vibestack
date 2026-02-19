/**
 * Script to fetch and cache OG images for all resources
 * Run with: npx tsx scripts/seed-og.ts
 *
 * Make sure to set up your .env.local with Supabase credentials first.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchOGData(url: string): Promise<{ ogImage: string | null; favicon: string }> {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(microlinkUrl);
    const data = await res.json();

    const ogImage = data?.data?.image?.url || data?.data?.logo?.url || null;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    return { ogImage, favicon };
  } catch (error) {
    console.error(`Failed to fetch OG data for ${url}:`, error);
    return {
      ogImage: null,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
  }
}

async function seedOGImages() {
  console.log("Fetching resources...");

  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, url, title, og_fetched_at")
    .is("og_fetched_at", null);

  if (error) {
    console.error("Error fetching resources:", error);
    process.exit(1);
  }

  if (!resources || resources.length === 0) {
    console.log("No resources need OG image fetching.");
    return;
  }

  console.log(`Found ${resources.length} resources to process...`);

  for (const resource of resources) {
    console.log(`Processing: ${resource.title}`);

    const { ogImage, favicon } = await fetchOGData(resource.url);

    const { error: updateError } = await supabase
      .from("resources")
      .update({
        og_image_url: ogImage,
        favicon_url: favicon,
        og_fetched_at: new Date().toISOString(),
      })
      .eq("id", resource.id);

    if (updateError) {
      console.error(`Failed to update ${resource.title}:`, updateError);
    } else {
      console.log(`  ✓ ${ogImage ? "OG image found" : "Using favicon fallback"}`);
    }

    // Rate limit: wait 500ms between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\nDone!");
}

seedOGImages();
