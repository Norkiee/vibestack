"use client";

import { useState, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
  searchQuery: string;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-[#f5f5f5] dark:border-white/10 rounded-full shadow-lg shadow-black/5 dark:shadow-black/20">
          <span className="pl-4 flex items-center">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Try "marketing with Claude"...'
            className="flex-1 py-2.5 pl-3 pr-10 text-sm text-primary placeholder:text-muted/50 bg-transparent focus:outline-none"
          />
          {isSearching ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin" />
            </div>
          ) : searchQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
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
        </div>
      </form>
    </div>
  );
}
