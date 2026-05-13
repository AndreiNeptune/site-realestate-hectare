"use client";

import { useState, useCallback } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { JUDETE, TIP_HECTAR_OPTIONS, PRET_MAX_LIMIT, SUPRAFATA_MAX_LIMIT } from "@/lib/constants";
import FilterSelect from "@/components/ui/FilterSelect";

export interface FilterValues {
  searchQuery: string;
  judet: string;
  tipHectar: string;
  pretMin: number;
  pretMax: number;
  suprafataMin: number;
  suprafataMax: number;
  sortare: string;
}



interface LandFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

export default function LandFilters({ filters, onFilterChange }: LandFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = useCallback(
    (key: keyof FilterValues, value: string | number) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange]
  );

  const resetFilters = () => {
    onFilterChange({
      searchQuery: "",
      judet: "",
      tipHectar: "",
      pretMin: 0,
      pretMax: PRET_MAX_LIMIT,

      suprafataMin: 0,
      suprafataMax: SUPRAFATA_MAX_LIMIT,
      sortare: "recent",
    });
  };

  const hasActiveFilters =
    filters.judet !== "" ||
    filters.tipHectar !== "" ||
    filters.pretMin > 0 ||
    filters.pretMax < PRET_MAX_LIMIT ||
    filters.suprafataMin > 0 ||
    filters.suprafataMax < SUPRAFATA_MAX_LIMIT;

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("ro-RO").format(n);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm transition-all duration-300">
      {/* Filter Header */}
      <div className="flex items-center justify-between px-5 py-3.5 min-h-[64px]">
        <button
          id="toggle-filters-button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span>Filtre <span className="hidden sm:inline">avansate</span></span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {hasActiveFilters && (
            <button
              id="reset-filters-button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-red-500 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resetează</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-[10px] font-bold text-muted uppercase tracking-wider hidden sm:block">
              Sortează:
            </label>
            <select
              id="sort-select"
              value={filters.sortare}
              onChange={(e) => updateFilter("sortare", e.target.value)}
              className="text-xs font-semibold text-foreground bg-surface px-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none min-w-[100px] sm:min-w-[140px] text-center"
            >
              <option value="recent">Cele mai noi</option>
              <option value="pret_asc">Preț: mic → mare</option>
              <option value="pret_desc">Preț: mare → mic</option>
              <option value="suprafata_asc">Suprafață: mică → mare</option>
              <option value="suprafata_desc">Suprafață: mare → mică</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-border animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Județ */}
            <div>
              <label
                htmlFor="filter-judet"
                className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2"
              >
                Județ
              </label>
              <FilterSelect
                id="filter-judet"
                value={filters.judet}
                onChange={(val) => updateFilter("judet", val)}
                searchable={true}
                options={[
                  { value: "", label: "Toate județele" },
                  ...JUDETE.map((j) => ({ value: j, label: j })),
                ]}
              />
            </div>

            {/* Tip Hectar */}
            <div>
              <label
                htmlFor="filter-tip-hectar"
                className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2"
              >
                Tip Proprietate
              </label>
              <FilterSelect
                id="filter-tip-hectar"
                value={filters.tipHectar}
                onChange={(val) => updateFilter("tipHectar", val)}
                options={[
                  { value: "", label: "Toate tipurile" },
                  ...TIP_HECTAR_OPTIONS,
                ]}
              />
            </div>

            {/* Preț Range */}
            <div>
              <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                Preț (€)
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{formatNumber(filters.pretMin)} €</span>
                  <span>{filters.pretMax >= PRET_MAX_LIMIT ? "NELIMITAT" : `${formatNumber(filters.pretMax)} €`}</span>
                </div>
                <div className="space-y-2">
                  <input
                    id="filter-pret-min"
                    type="range"
                    min={0}
                    max={PRET_MAX_LIMIT}
                    step={5000}
                    value={filters.pretMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= filters.pretMax) updateFilter("pretMin", val);
                    }}
                  />
                  <input
                    id="filter-pret-max"
                    type="range"
                    min={0}
                    max={PRET_MAX_LIMIT}
                    step={5000}
                    value={filters.pretMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= filters.pretMin) updateFilter("pretMax", val);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Suprafață Range */}
            <div>
              <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                Suprafață <span className="normal-case">(m²)</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{formatNumber(filters.suprafataMin)} m²</span>
                  <span>{filters.suprafataMax >= SUPRAFATA_MAX_LIMIT ? "NELIMITAT" : `${formatNumber(filters.suprafataMax)} m²`}</span>
                </div>
                <div className="space-y-2">
                  <input
                    id="filter-suprafata-min"
                    type="range"
                    min={0}
                    max={SUPRAFATA_MAX_LIMIT}
                    step={500}
                    value={filters.suprafataMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= filters.suprafataMax) updateFilter("suprafataMin", val);
                    }}
                  />
                  <input
                    id="filter-suprafata-max"
                    type="range"
                    min={0}
                    max={SUPRAFATA_MAX_LIMIT}
                    step={500}
                    value={filters.suprafataMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= filters.suprafataMin) updateFilter("suprafataMax", val);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
