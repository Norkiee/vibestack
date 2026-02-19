import { CategoryFilter } from "./types";

export const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "launch", label: "Launch" },
  { id: "reddit", label: "Reddit" },
  { id: "slack", label: "Slack" },
  { id: "building", label: "Building" },
  { id: "ai-marketing", label: "AI Marketing" },
  { id: "seo", label: "SEO" },
] as const;
