"use client";

import { useState } from "react";
import Image from "next/image";

interface OGThumbnailProps {
  ogImageUrl: string | null;
  faviconUrl: string | null;
  title: string;
  domain: string;
}

export function OGThumbnail({ ogImageUrl, faviconUrl, title, domain }: OGThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackFavicon = faviconUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  // Show OG image if available and no error
  if (ogImageUrl && !imageError) {
    return (
      <div className="relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0">
        {loading && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
        <Image
          src={ogImageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="56px"
          onLoad={() => setLoading(false)}
          onError={() => {
            setImageError(true);
            setLoading(false);
          }}
        />
      </div>
    );
  }

  // Fallback: just the favicon
  return (
    <div className="w-14 h-10 flex items-center justify-center flex-shrink-0">
      <Image
        src={fallbackFavicon}
        alt={`${domain} favicon`}
        width={20}
        height={20}
        className="object-contain"
        onError={(e) => {
          // Hide if favicon also fails
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
