import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SearchButtonProps } from "./SearchButton.types";
import { Search, X } from "lucide-react";

export const SearchButton = ({ size = "md", className = "", ...props }: SearchButtonProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center h-10 transition-all duration-700 ease-[cubic-bezier(0.3,0,0,1)] overflow-hidden ${
        isOpen ? "w-48 md:w-60" : "w-10"
      } ${className}`}
      {...props}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center h-full w-full relative"
      >
        {/* Expanded input bar */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`font-body text-xs tracking-wider uppercase h-9 w-full rounded-[9999px] bg-surface-hover/10 text-current placeholder:!text-current placeholder:!opacity-90 focus:outline-none focus:ring-1 focus:ring-current/30 border transition-all duration-700 ease-[cubic-bezier(0.3,0,0,1)] !pl-10 !pr-8 ${
            isOpen
              ? "border-current/25 opacity-100"
              : "border-transparent opacity-0 pointer-events-none"
          }`}
        />

        {/* Search Icon / Toggle Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute left-0 flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover/10 transition-all duration-300 active:scale-95 active:duration-75 ${
            isOpen ? "pointer-events-none" : "cursor-pointer"
          }`}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-current" strokeWidth={1.5} />
        </button>

        {/* Close button inside input when open */}
        {isOpen && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 flex items-center justify-center p-0.5 rounded-full hover:bg-current/10 text-current cursor-pointer transition-all duration-300 active:scale-90 active:duration-75"
            aria-label="Close search"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </form>
    </div>
  );
};
