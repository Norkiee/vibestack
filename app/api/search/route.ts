import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resource } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabaseAdmin = getSupabaseAdmin();

    // Fetch all resources
    const { data: resources, error } = await supabaseAdmin
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!resources || resources.length === 0) {
      return NextResponse.json({ resources: [] });
    }

    // Try AI search
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const prompt = `You are a resource matcher. Given this query and list of resources, return ONLY a JSON array of the most relevant resource titles (exact match). Return 3-8 results ranked by relevance. No explanation, just the JSON array of title strings.

Query: "${query}"

Resources:
${resources.map((r: Resource) => `[${r.category}] "${r.title}" - ${r.description} (${r.url})`).join("\n")}

Return format: ["Title 1", "Title 2", ...]`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";

      // Parse the JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      const matchedTitles: string[] = JSON.parse(jsonMatch[0]);

      // Filter resources by matched titles
      const matchedResources = matchedTitles
        .map((title) =>
          resources.find(
            (r: Resource) => r.title.toLowerCase() === title.toLowerCase()
          )
        )
        .filter(Boolean) as Resource[];

      return NextResponse.json({ resources: matchedResources, query });
    } catch (aiError) {
      console.error("AI search failed, falling back to keyword search:", aiError);

      // Fallback: keyword matching
      const queryLower = query.toLowerCase();
      const keywords = queryLower.split(/\s+/);

      const scoredResources = resources.map((r: Resource) => {
        const searchText = `${r.title} ${r.description} ${r.category}`.toLowerCase();
        const score = keywords.reduce((acc, keyword) => {
          return acc + (searchText.includes(keyword) ? 1 : 0);
        }, 0);
        return { resource: r, score };
      });

      const matchedResources = scoredResources
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(({ resource }) => resource);

      return NextResponse.json({ resources: matchedResources, query, fallback: true });
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
