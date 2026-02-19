"use client";

import { CATEGORIES } from "@/lib/constants";
import { CategoryFilter } from "@/lib/types";

interface CategoryPillsProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function CategoryPills({ activeCategory, onCategoryChange }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-1.5 text-[13px] rounded-full transition-colors ${
            activeCategory === category.id
              ? "bg-primary text-white font-medium"
              : "bg-bg-pill text-secondary hover:bg-border-light"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
