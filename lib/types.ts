export interface Resource {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  category: Category;
  og_image_url: string | null;
  favicon_url: string | null;
  og_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export type Category = "launch" | "reddit" | "slack" | "building" | "ai-marketing" | "seo";

export type CategoryFilter = Category | "all";
