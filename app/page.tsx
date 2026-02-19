import { Resource } from "@/lib/types";
import { HomeClient } from "@/components/home-client";

// Force dynamic rendering since we fetch from database
export const dynamic = "force-dynamic";

async function getResources(): Promise<Resource[]> {
  // Skip during build when env vars aren't available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase");

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return [];
  }
}

export default async function Home() {
  const resources = await getResources();

  return (
    <main className="min-h-screen bg-white">
      <HomeClient initialResources={resources} />
    </main>
  );
}
