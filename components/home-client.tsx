"use client";

import { useState, useCallback } from "react";
import { Resource, CategoryFilter } from "@/lib/types";
import { SearchBar } from "./search-bar";
import { CategoryPills } from "./category-pills";
import { ResourceList } from "./resource-list";

interface HomeClientProps {
  initialResources: Resource[];
}

export function HomeClient({ initialResources }: HomeClientProps) {
  const [resources] = useState<Resource[]>(initialResources);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(initialResources);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filterByCategory = useCallback(
    (category: CategoryFilter) => {
      if (category === "all") {
        return resources;
      }
      return resources.filter((r) => r.category === category);
    },
    [resources]
  );

  const handleCategoryChange = useCallback(
    (category: CategoryFilter) => {
      setActiveCategory(category);
      setSearchQuery("");
      setFilteredResources(filterByCategory(category));
    },
    [filterByCategory]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      setSearchQuery(query);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setFilteredResources(data.resources || []);
        setActiveCategory("all");
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to client-side search
        const queryLower = query.toLowerCase();
        const keywords = queryLower.split(/\s+/);
        const matched = resources
          .map((r) => {
            const searchText = `${r.title} ${r.description} ${r.category}`.toLowerCase();
            const score = keywords.reduce((acc, kw) => acc + (searchText.includes(kw) ? 1 : 0), 0);
            return { resource: r, score };
          })
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8)
          .map(({ resource }) => resource);
        setFilteredResources(matched);
      } finally {
        setIsSearching(false);
      }
    },
    [resources]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredResources(filterByCategory(activeCategory));
  }, [activeCategory, filterByCategory]);

  return (
    <div className="w-full max-w-page mx-auto px-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-header-top pb-6">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-medium tracking-[-0.02em] text-primary">vibestack</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
        </div>
        <span className="text-sm font-serif italic text-secondary">resources for builders</span>
      </header>

      {/* Search */}
      <div className="mt-search-top mb-search-bottom">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          searchQuery={searchQuery}
        />
      </div>

      {/* Category pills */}
      <div className="mb-pills-bottom">
        <CategoryPills activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>

      {/* Resource list */}
      <ResourceList
        resources={filteredResources}
        searchQuery={searchQuery || undefined}
      />

      {/* Footer */}
      <footer className="mt-footer-top pb-8 border-t border-border-faint pt-6 text-center">
        <span className="text-xs font-serif italic text-ghost">
          curated for the vibe builder community
        </span>
      </footer>
    </div>
  );
}
