"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
  hideBorder?: boolean;
}

export default function SearchInput({
  label,
  value,
  onChange,
  onEnter,
  placeholder = "Caută...",
  icon = <Search className="w-5 h-5" />,
  hideBorder = false,
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 group ${!hideBorder ? 'sm:border-r border-border/40' : ''} last:border-0 min-w-[140px]`}>
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-left w-full h-full">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
          {/* Resize icon slightly */}
          <div className="scale-75 sm:scale-90 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.12em] mb-0 cursor-pointer pointer-events-none">
            {label}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onEnter) {
                onEnter();
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-[12px] sm:text-[13px] font-bold text-foreground placeholder:text-muted/40 focus:outline-none -mt-0.5"
          />
        </div>
      </div>
    </div>
  );
}
