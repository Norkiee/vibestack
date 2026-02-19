"use client";

import { Resource } from "@/lib/types";
import { OGThumbnail } from "./og-thumbnail";

interface ResourceRowProps {
  resource: Resource;
  index: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ResourceRow({ resource, index }: ResourceRowProps) {
  const animationDelay = Math.min(index * 0.03, 0.35);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3.5 py-3 px-2 -mx-2 rounded-md transition-colors duration-150 hover:bg-bg-hover animate-fade-up"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <OGThumbnail
        ogImageUrl={resource.og_image_url}
        faviconUrl={resource.favicon_url}
        title={resource.title}
        domain={resource.domain}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-primary truncate">{resource.title}</span>
          <span className="text-xs text-muted flex-shrink-0">{resource.domain}</span>
        </div>
        <p className="text-xs text-muted truncate mt-0.5">{resource.description}</p>
      </div>
      <span className="text-xs text-faint flex-shrink-0">
        {formatDate(resource.created_at)}
      </span>
    </a>
  );
}
