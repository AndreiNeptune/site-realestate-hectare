"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw, Check, Wallet, Maximize2, MapPin, Home, Zap, Droplets, Flame, Waves, Power } from "lucide-react";

interface FilterValues {
  searchQuery: string;
  judet: string;
  tipHectar: string;
  pretMin: number;
  pretMax: number;
  suprafataMin: number;
  suprafataMax: number;
  sortare: string;
  hasCurent: boolean;
  hasApa: boolean;
  hasGaz: boolean;
  hasCanalizare: boolean;
}

interface AdvancedFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

const PRET_MAX_LIMIT = 500000;
const SUPRAFATA_MAX_LIMIT = 50000;

export default function AdvancedFilterSheet({
  isOpen,
  onClose,
  filters: initialFilters,
  onApply,
  onReset
}: AdvancedFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(initialFilters);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(initialFilters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialFilters]);

  const updateLocalFilter = useCallback((key: keyof FilterValues, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const formatNumber = (n: number) => new Intl.NumberFormat("ro-RO").format(n);

  if (!isMounted || !isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[10000] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">Filtre Avansate</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Personalizează căutarea</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted hover:text-foreground transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
          
          {/* Price Range */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs font-black text-foreground uppercase tracking-widest">
                <Wallet className="w-4 h-4 text-primary" />
                <span>Buget (€)</span>
              </label>
              <div className="px-3 py-1 bg-primary/5 rounded-full text-[11px] font-bold text-primary border border-primary/10">
                {formatNumber(localFilters.pretMin)} - {localFilters.pretMax === 0 ? "nelimitat" : `${formatNumber(localFilters.pretMax)} €`}
              </div>
            </div>
            <div className="space-y-5 px-1">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest flex justify-between">
                  <span>Minim</span>
                  <span className="text-foreground">{formatNumber(localFilters.pretMin)} €</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={PRET_MAX_LIMIT}
                  step={5000}
                  value={localFilters.pretMin}
                  onChange={(e) => updateLocalFilter("pretMin", Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest flex justify-between">
                  <span>Maxim</span>
                  <span className="text-foreground">{localFilters.pretMax === 0 ? "Nelimitat" : `${formatNumber(localFilters.pretMax)} €`}</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={PRET_MAX_LIMIT}
                  step={5000}
                  value={localFilters.pretMax}
                  onChange={(e) => updateLocalFilter("pretMax", Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs font-black text-foreground uppercase tracking-widest">
                <Maximize2 className="w-4 h-4 text-primary" />
                <span>Suprafață (ha)</span>
              </label>
              <div className="px-3 py-1 bg-primary/5 rounded-full text-[11px] font-bold text-primary border border-primary/10">
                {formatNumber(localFilters.suprafataMin)} - {localFilters.suprafataMax >= SUPRAFATA_MAX_LIMIT ? "50.0+ ha" : `${formatNumber(localFilters.suprafataMax)} ha`}
              </div>
            </div>
            <div className="space-y-5 px-1">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest flex justify-between">
                  <span>Minim</span>
                  <span className="text-foreground">{localFilters.suprafataMin} ha</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={SUPRAFATA_MAX_LIMIT}
                  step={100}
                  value={localFilters.suprafataMin}
                  onChange={(e) => updateLocalFilter("suprafataMin", Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest flex justify-between">
                  <span>Maxim</span>
                  <span className="text-foreground">{localFilters.suprafataMax >= SUPRAFATA_MAX_LIMIT ? "Nelimitat" : `${localFilters.suprafataMax} ha`}</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={SUPRAFATA_MAX_LIMIT}
                  step={100}
                  value={localFilters.suprafataMax}
                  onChange={(e) => updateLocalFilter("suprafataMax", Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Utilități */}
          <div className="space-y-6 pt-4 border-t border-border/50">
            <label className="flex items-center gap-2.5 text-xs font-black text-foreground uppercase tracking-widest">
              <Zap className="w-4 h-4 text-primary" />
              <span>Utilități Disponibile</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "hasCurent", label: "Curent", icon: <Zap className="w-3.5 h-3.5" /> },
                { key: "hasApa", label: "Apă", icon: <Droplets className="w-3.5 h-3.5" /> },
                { key: "hasGaz", label: "Gaz", icon: <Flame className="w-3.5 h-3.5" /> },
                { key: "hasCanalizare", label: "Canalizare", icon: <Waves className="w-3.5 h-3.5" /> },
              ].map((util) => (
                <button
                  key={util.key}
                  type="button"
                  onClick={() => updateLocalFilter(util.key as keyof FilterValues, !localFilters[util.key as keyof FilterValues])}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                    localFilters[util.key as keyof FilterValues]
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-surface border-border/60 text-muted hover:border-primary/40"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    localFilters[util.key as keyof FilterValues] ? "bg-primary/10 text-primary" : "bg-white border border-border/60 text-muted/60"
                  }`}>
                    {util.icon}
                  </div>
                  <span>{util.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tip Hectar */}
          <div className="space-y-6 pt-4 border-t border-border/50">
            <label className="flex items-center gap-2.5 text-xs font-black text-foreground uppercase tracking-widest">
              <Home className="w-4 h-4 text-primary" />
              <span>Tip Proprietate</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "", label: "Toate" },
                { value: "rezidential", label: "Rezidențial" },
                { value: "industrial", label: "Industrial" },
                { value: "agricol", label: "Agricol" },
                { value: "pasune", label: "Pășune" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateLocalFilter("tipHectar", opt.value)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    localFilters.tipHectar === opt.value
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-surface border-border/60 text-foreground/70 hover:border-primary/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sortare */}
          <div className="space-y-6 pt-4 border-t border-border/50">
            <label className="flex items-center gap-2.5 text-xs font-black text-foreground uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Ordonare rezultate</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "recent", label: "Cele mai noi" },
                { value: "pret_asc", label: "Preț: mic → mare" },
                { value: "pret_desc", label: "Preț: mare → mic" },
                { value: "suprafata_asc", label: "Suprafață: mică → mare" },
                { value: "suprafata_desc", label: "Suprafață: mare → mică" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateLocalFilter("sortare", opt.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    localFilters.sortare === opt.value
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-surface border-border/60 text-foreground/70 hover:border-primary/40"
                  }`}
                >
                  <span>{opt.label}</span>
                  {localFilters.sortare === opt.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border/50 bg-slate-50/50 flex gap-4">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-white text-xs font-black text-muted uppercase tracking-widest hover:bg-slate-50 hover:text-foreground transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resetează</span>
          </button>
          <button
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
            className="flex-[1.5] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
          >
            <Check className="w-4 h-4" />
            <span>Aplică Filtrele</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
