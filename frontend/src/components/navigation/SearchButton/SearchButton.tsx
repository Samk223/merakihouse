import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SearchButtonProps } from "./SearchButton.types";
import { Search, X, Loader2 } from "lucide-react";
import apiClient from "../../../api/apiClient";
import { resolveProductImage } from "../../../utils/imageHelper";

export const SearchButton = ({ size = "md", className = "", ...props }: SearchButtonProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  // Suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        setShowSuggestions(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Debounced suggestions fetching
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setShowSuggestions(true);
      try {
        const response = await apiClient.get("/products", {
          params: {
            search: query.trim(),
            per_page: 5,
          },
        });
        if (response.data.success) {
          const list = response.data.data.data || [];
          setSuggestions(list);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center h-10 transition-all duration-700 ease-[cubic-bezier(0.3,0,0,1)] ${
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
          onFocus={() => {
            if (query.trim().length >= 2) {
              setShowSuggestions(true);
            }
          }}
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
              setShowSuggestions(false);
            }}
            className="absolute right-3 flex items-center justify-center p-0.5 rounded-full hover:bg-current/10 text-current cursor-pointer transition-all duration-300 active:scale-90 active:duration-75"
            aria-label="Close search"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown Overlay */}
      {isOpen && showSuggestions && query.trim().length >= 2 && (
        <div className="absolute top-[48px] right-0 w-64 md:w-72 bg-white border border-[#28273F]/10 rounded-[16px] shadow-[0_12px_40px_rgba(40,39,63,0.12)] p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#9D6C76]" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-4 text-[10px] text-[#666666] font-body">
              No products found
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-widest text-[#9D6C76] font-bold px-2 py-1 block border-b border-[#28273F]/5 mb-1">
                Suggestions
              </span>
              {suggestions.map((product) => {
                const imgUrl = resolveProductImage(
                  product.images?.find((img: any) => img.is_primary)?.path || product.images?.[0]?.path
                );
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      navigate(`/product/${product.slug}`);
                      setIsOpen(false);
                      setShowSuggestions(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-[8px] hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-8 h-8 rounded-[6px] object-cover bg-[#FAF6F0]"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-heading text-xs text-[#28273F] font-semibold truncate leading-tight">
                        {product.name}
                      </h4>
                      <span className="font-body text-[10px] text-[#9D6C76] font-medium block mt-0.5">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
