"use client";

import { Resource } from "@/lib/types";
import { ResourceRow } from "./resource-row";

interface ResourceListProps {
  resources: Resource[];
  searchQuery?: string;
}

export function ResourceList({ resources, searchQuery }: ResourceListProps) {
  return (
    <div>
      {/* Search results header */}
      {searchQuery && (
        <div className="py-2 mb-2">
          <span className="text-xs font-serif italic text-secondary">
            {resources.length} result{resources.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </span>
        </div>
      )}

      {/* Resource rows */}
      <div className="divide-y divide-border-faint">
        {resources.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">
            No resources found
          </div>
        ) : (
          resources.map((resource, index) => (
            <ResourceRow key={resource.id} resource={resource} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
