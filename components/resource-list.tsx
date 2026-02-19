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
      {/* Table header */}
      <div className="flex items-center justify-between py-2 border-b border-border-faint mb-2">
        {searchQuery ? (
          <span className="text-xs font-serif italic text-secondary">
            {resources.length} result{resources.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </span>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.06em] text-muted">
            Title
          </span>
        )}
        <span className="text-[11px] uppercase tracking-[0.06em] text-muted">
          Added
        </span>
      </div>

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
