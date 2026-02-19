"use client";

import { Resource } from "@/lib/types";
import { OGThumbnail } from "./og-thumbnail";

interface ResourceRowProps {
  resource: Resource;
  index: number;
}

export function ResourceRow({ resource, index }: ResourceRowProps) {
  const animationDelay = Math.min(index * 0.03, 0.35);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3.5 py-3 transition-colors duration-150 hover:bg-bg-hover animate-fade-up"
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
      <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>
    </a>
  );
}
