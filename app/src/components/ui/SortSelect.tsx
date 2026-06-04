"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SortSelectProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  className?: string;
}

export default function SortSelect({ id, value, onChange, options, className = "" }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs font-bold text-foreground bg-white px-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer flex items-center justify-center gap-2 select-none ${className}`}
      >
        <span>{selected ? selected.label : ""}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-border/60 z-50 overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-xs font-bold text-center transition-all ${
                value === opt.value
                  ? "text-primary bg-primary/5"
                  : "text-foreground/80 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
