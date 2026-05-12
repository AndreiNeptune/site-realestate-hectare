"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, MapPin, ArrowLeft, Home, Wallet, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { JUDETE } from "@/lib/constants";
import LandCard from "@/components/lands/LandCard";
import SearchSelect from "@/components/ui/SearchSelect";
import SearchInput from "@/components/ui/SearchInput";
import AdvancedFilterSheet from "@/components/ui/AdvancedFilterSheet";

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

const BUDGET_OPTIONS = [
  { value: 0, label: "Orice buget" },
  { value: 25000, label: "Sub 25.000 €" },
  { value: 50000, label: "25.000 — 50.000 €" },
  { value: 100000, label: "50.000 — 100.000 €" },
  { value: 500000, label: "100.000 €+" },
];

const TIP_OPTIONS = [
  { value: "", label: "Toate tipurile" },
  { value: "rezidential", label: "Rezidențial" },
  { value: "industrial", label: "Industrial" },
  { value: "agricol", label: "Agricol" },
  { value: "pasune", label: "Pășune" },
];

const INITIAL_FILTERS: FilterValues = {
  searchQuery: "",
  judet: "",
  tipHectar: "",
  pretMin: 0,
  pretMax: 0,
  suprafataMin: 0,
  suprafataMax: 50000,
  sortare: "recent",
  hasCurent: false,
  hasApa: false,
  hasGaz: false,
  hasCanalizare: false,
};

interface HectareClientProps {
  initialLands: any[];
}

export default function HectareClient({ initialLands }: HectareClientProps) {
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS);
  const [dbLands] = useState<any[]>(initialLands);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Client-side filtering logic
  const filteredLands = useMemo(() => {
    let results = [...dbLands];

    // Search query - improved to search in title, location, and description
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.titlu.toLowerCase().includes(q) ||
          l.localitate.toLowerCase().includes(q) ||
          l.judet.toLowerCase().includes(q) ||
          l.descriere?.toLowerCase().includes(q)
      );
    }

    // Județ filter
    if (filters.judet) {
      results = results.filter((l) => l.judet === filters.judet);
    }

    // Tip hectar filter
    if (filters.tipHectar) {
      results = results.filter((l) => l.tip_hectar === filters.tipHectar);
    }

    // Price range
    results = results.filter(
      (l) => Number(l.pret) >= filters.pretMin && (filters.pretMax === 0 || Number(l.pret) <= filters.pretMax)
    );

    // Area range
    results = results.filter(
      (l) => Number(l.suprafata_mp) >= filters.suprafataMin && Number(l.suprafata_mp) <= filters.suprafataMax
    );

    // Utilities filtering
    if (filters.hasCurent) {
      results = results.filter((l) => l.has_curent);
    }
    if (filters.hasApa) {
      results = results.filter((l) => l.has_apa);
    }
    if (filters.hasGaz) {
      results = results.filter((l) => l.has_gaz);
    }
    if (filters.hasCanalizare) {
      results = results.filter((l) => l.has_canalizare);
    }

    // Sorting
    switch (filters.sortare) {
      case "pret_asc":
        results.sort((a, b) => Number(a.pret) - Number(b.pret));
        break;
      case "pret_desc":
        results.sort((a, b) => Number(b.pret) - Number(a.pret));
        break;
      case "suprafata_asc":
        results.sort((a, b) => Number(a.suprafata_mp) - Number(b.suprafata_mp));
        break;
      case "suprafata_desc":
        results.sort((a, b) => Number(b.suprafata_mp) - Number(a.suprafata_mp));
        break;
      default: // "recent"
        results.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return results;
  }, [filters, dbLands]);

  const updateFilter = (key: keyof FilterValues, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const judeteOptions = useMemo(() => [
    { value: "", label: "Toate județele" },
    ...JUDETE.map(j => ({ value: j, label: j }))
  ], []);

  const handleSearch = () => {
    document.getElementById("results-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Page Header — Hero Style */}
      <section className="relative min-h-[600px] flex flex-col bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-hectare.png"
            alt="Field of hectares"
            fill
            className="object-cover opacity-60"
            priority
            quality={75}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/90 via-primary-dark/60 to-surface" />
        </div>

        {/* Floating blurs ("Blue stuff") */}
        <div className="absolute top-24 left-[15%] w-72 h-72 bg-accent/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-48 right-[10%] w-96 h-96 bg-primary-light/10 rounded-full blur-[150px] animate-pulse-glow" />

        {/* Header Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-48 pb-32 lg:pb-48 px-6 sm:px-10 lg:px-16 w-full text-center">
          <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-black text-white/40 mb-8 hover:text-accent transition-colors group tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>ÎNAPOI ACASĂ</span>
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight animate-fade-in-up">
              Explorează <span className="gradient-text">Hectare</span> Verificate
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-16 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Găsește oportunitatea perfectă în selecția noastră premium.
              <br className="hidden sm:block" />
              Toate proprietățile sunt verificate legal pentru tranzacții sigure.
            </p>

            {/* ============== Centered Search Bar ============== */}
            <div
              className="relative z-40 w-fit max-w-full mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="search-bar-v2 !p-2 sm:!p-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Row 1 (Mobile): Search + Advanced */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 sm:w-64">
                      <SearchInput
                        label="Căutare"
                        value={filters.searchQuery}
                        onChange={(val) => updateFilter("searchQuery", val)}
                        onEnter={handleSearch}
                        placeholder="Cuvânt cheie..."
                        icon={<Search className="w-5 h-5" />}
                        hideBorder={true}
                      />
                    </div>
                    {/* Advanced Filters Button (Mobile only here) */}
                    <div className="sm:hidden">
                      <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="flex items-center justify-center w-[52px] h-[52px] bg-primary-dark text-white rounded-xl hover:bg-primary transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
                        title="Filtre Avansate"
                      >
                        <SlidersHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2 (Mobile): Filters */}
                  <div className="grid grid-cols-3 gap-0.5 sm:flex sm:items-center sm:gap-2">
                    <div className="col-span-1">
                      <SearchSelect
                        label="Tip"
                        icon={<Home className="w-5 h-5" />}
                        options={TIP_OPTIONS}
                        value={filters.tipHectar}
                        onChange={(val) => updateFilter("tipHectar", val)}
                        hideBorder={true}
                        hideIconMobile={true}
                      />
                    </div>

                    <div className="col-span-1">
                      <SearchSelect
                        label="Locație"
                        icon={<MapPin className="w-5 h-5" />}
                        options={judeteOptions}
                        value={filters.judet}
                        onChange={(val) => updateFilter("judet", val)}
                        searchable={true}
                        hideBorder={true}
                        hideIconMobile={true}
                      />
                    </div>

                    <div className="col-span-1">
                      <SearchSelect
                        label="Buget"
                        icon={<Wallet className="w-5 h-5" />}
                        options={BUDGET_OPTIONS}
                        value={filters.pretMax}
                        onChange={(val) => updateFilter("pretMax", val)}
                        hideBorder={true}
                        hideIconMobile={true}
                      />
                    </div>

                    {/* Advanced Filters Button (Desktop only here) */}
                    <div className="hidden sm:block">
                      <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="flex items-center justify-center w-[72px] h-[72px] bg-primary-dark text-white rounded-[22px] hover:bg-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary-dark/20 cursor-pointer active:scale-95 group shadow-md"
                        title="Filtre Avansate"
                      >
                        <SlidersHorizontal className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div id="results-list" className="site-main-container py-16 sm:py-24">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {filteredLands.length} <span className="text-muted font-medium">Hectare disponibile</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest hidden sm:block">Sortează:</label>
            <select
              value={filters.sortare}
              onChange={(e) => updateFilter("sortare", e.target.value)}
              className="bg-white border border-border rounded-xl px-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-center"
            >
              <option value="recent">Cele mai noi</option>
              <option value="pret_asc">Preț: mic → mare</option>
              <option value="pret_desc">Preț: mare → mic</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredLands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredLands.map((land, index) => (
              <LandCard key={land.id} land={land} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-border p-20 flex flex-col items-center text-center shadow-xl shadow-black/[0.02]">
            <div className="w-24 h-24 bg-surface rounded-[2rem] flex items-center justify-center mb-8 mx-auto border border-border shadow-inner">
              <Search className="w-10 h-10 text-muted/20" />
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Niciun hectar găsit</h3>
            <p className="text-muted text-base max-w-md mx-auto leading-relaxed mb-10">
              Nu am găsit hectare care să corespundă filtrelor tale. Încearcă să resetezi criteriile de căutare.
            </p>
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="px-10 py-4 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 cursor-pointer active:scale-95"
            >
              Resetează Căutarea
            </button>
          </div>
        )}
      </div>

      <AdvancedFilterSheet
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />
    </main>
  );
}
