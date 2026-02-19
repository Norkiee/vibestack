"use client";

import { useState, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
  searchQuery: string;
}

export function SearchBar({ onSearch, onClear, isSearching, searchQuery }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
        <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-muted bg-bg-pill border border-border-light rounded">
          /
        </kbd>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Try "how do I market with Claude" or "best place to launch"...'
        className="w-full py-3 pl-10 pr-10 text-sm text-primary placeholder:text-muted bg-white border border-border rounded-lg focus:outline-none focus:border-secondary transition-colors"
      />
      {isSearching ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searchQuery ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
    </form>
  );
}
