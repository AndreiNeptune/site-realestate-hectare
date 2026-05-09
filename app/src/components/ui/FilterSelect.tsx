"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
}

export default function FilterSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Selectează...",
  searchable = false,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen && searchable) {
      setSearchTerm("");
      // Using a small timeout to ensure the element is rendered and reachable
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter and sort options based on relevance
  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return options;

    return options
      .filter((opt) => opt.label.toLowerCase().includes(term))
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase();
        const bLabel = b.label.toLowerCase();

        // 1. Exact match priority
        if (aLabel === term && bLabel !== term) return -1;
        if (bLabel === term && aLabel !== term) return 1;

        // 2. Starts with priority
        const aStarts = aLabel.startsWith(term);
        const bStarts = bLabel.startsWith(term);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;

        // 3. Alphabetical tie-breaker
        return aLabel.localeCompare(bLabel);
      });
  }, [options, searchTerm]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-surface rounded-xl text-sm font-medium text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-border/60 z-50 animate-slide-up overflow-hidden flex flex-col">
          {searchable && (
            <div className="px-2 pb-1.5 pt-0.5 border-b border-border/50 sticky top-0 bg-white z-10">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Caută..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface rounded-lg text-xs border-none focus:ring-1 focus:ring-primary/30 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-64 overflow-y-auto py-2 flex flex-col items-stretch">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`mx-1.5 mb-0.5 last:mb-0 px-4 py-2 text-sm font-semibold rounded-xl text-left transition-all duration-200 block w-auto ${
                    value === opt.value
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-foreground/80 hover:bg-slate-100 hover:text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-muted text-center">
                Niciun rezultat găsit
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
