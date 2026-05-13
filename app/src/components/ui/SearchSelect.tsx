"use client";
 
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
 
interface Option {
  value: string | number;
  label: string;
}
 
interface SearchSelectProps {
  label: string;
  icon: React.ReactNode;
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  searchable?: boolean;
  hideBorder?: boolean;
  hideIconMobile?: boolean;
}
 
export default function SearchSelect({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "Selectează...",
  searchable = false,
  hideBorder = false,
  hideIconMobile = false,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
 
  // Close when clicking outside
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
 
  const dropdownMenu = isOpen ? (
    <div
      className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-3xl border border-border/60 z-[100] animate-slide-up overflow-hidden flex flex-col"
    >
      {searchable && (
        <div className="px-3 pb-2 pt-1 border-b border-border/40 sticky top-0 bg-white z-10">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Caută județ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border-none focus:ring-1 focus:ring-primary/20 outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
 
      <div className="max-h-60 overflow-y-auto py-2 flex flex-col items-stretch">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`mx-1.5 mb-1 last:mb-0 px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all duration-200 block w-auto ${option.value === value
                ? "text-primary bg-primary/10 shadow-sm"
                : "text-foreground/70 hover:bg-slate-100 hover:text-primary"
                }`}
            >
              {option.label}
            </button>
          ))
        ) : (
          <div className="px-5 py-3 text-xs text-muted font-medium italic text-center">Nicio opțiune găsită</div>
        )}
      </div>
    </div>
  ) : null;
 
  return (
    <div ref={containerRef} className={`relative flex-1 group ${!hideBorder ? "sm:border-r border-border/40" : ""} last:border-0`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-left w-full hover:bg-surface/50 transition-colors focus:outline-none"
      >
        {!hideIconMobile && (
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 ${isOpen ? "text-primary shadow-inner" : "text-slate-400"} transition-all`}>
            <div className="scale-75 sm:scale-90 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        {hideIconMobile && (
          <div className={`hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center flex-shrink-0 ${isOpen ? "text-primary shadow-inner" : "text-slate-400"} transition-all`}>
            <div className="scale-90 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.12em] mb-0 cursor-pointer">
            {label}
          </label>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] sm:text-[13px] font-bold text-foreground -mt-0.5 leading-tight">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-300 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>
 
      {dropdownMenu}
    </div>
  );
}
