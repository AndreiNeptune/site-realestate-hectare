"use client";

import { useState, useMemo, useEffect } from "react";
import { Landmark, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PRET_MAX_LIMIT, SUPRAFATA_MAX_LIMIT } from "@/lib/constants";
import HeroSection from "@/components/home/HeroSection";
const StatsSection = dynamic(() => import("@/components/home/StatsSection"), { ssr: false });
const TrustSection = dynamic(() => import("@/components/home/TrustSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: false });
import LandFilters, { type FilterValues } from "@/components/lands/LandFilters";
import LandCard from "@/components/lands/LandCard";

const INITIAL_FILTERS: FilterValues = {
  searchQuery: "",
  judet: "",
  tipHectar: "",
  pretMin: 0,
  pretMax: PRET_MAX_LIMIT,
  suprafataMin: 0,
  suprafataMax: SUPRAFATA_MAX_LIMIT,
  sortare: "recent",
};

interface HomeClientProps {
  initialLands: any[];
}

export default function HomeClient({ initialLands }: HomeClientProps) {
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS);
  const [dbLands, setDbLands] = useState<any[]>(initialLands);

  const handleHeroSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroJudetChange = (judet: string) => {
    setFilters((prev) => ({ ...prev, judet }));
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroTipHectarChange = (tipHectar: string) => {
    setFilters((prev) => ({ ...prev, tipHectar }));
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroBudgetChange = (budget: number) => {
    setFilters((prev) => ({ ...prev, pretMax: budget || 500000 }));
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  // Client-side filtering logic
  const filteredLands = useMemo(() => {
    let results = [...dbLands];

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.titlu.toLowerCase().includes(q) ||
          l.localitate.toLowerCase().includes(q) ||
          l.judet.toLowerCase().includes(q) ||
          l.tip_hectar.toLowerCase().includes(q)
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

    // Price range (calculate total price since DB price is per sqm)
    results = results.filter((l) => {
      const totalPrice = Number(l.pret) * Number(l.suprafata_mp);
      const isOverMax = filters.pretMax >= PRET_MAX_LIMIT;
      return totalPrice >= filters.pretMin && (filters.pretMax === 0 || isOverMax || totalPrice <= filters.pretMax);
    });

    // Area range (using sqm directly)
    results = results.filter((l) => {
      const areaMp = Number(l.suprafata_mp);
      const isOverMax = filters.suprafataMax >= SUPRAFATA_MAX_LIMIT;
      return areaMp >= filters.suprafataMin && (isOverMax || areaMp <= filters.suprafataMax);
    });

    // Sorting
    switch (filters.sortare) {
      case "pret_asc":
        results.sort((a, b) => (Number(a.pret) * Number(a.suprafata_mp)) - (Number(b.pret) * Number(b.suprafata_mp)));
        break;
      case "pret_desc":
        results.sort((a, b) => (Number(b.pret) * Number(b.suprafata_mp)) - (Number(a.pret) * Number(a.suprafata_mp)));
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalItems = filteredLands.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedLands = useMemo(() => {
    return filteredLands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredLands, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        onSearch={handleHeroSearch}
        onJudetChange={handleHeroJudetChange}
        onTipHectarChange={handleHeroTipHectarChange}
        onBudgetChange={handleHeroBudgetChange}
      />

      {/* Stats Section — floats over hero */}
      <StatsSection />

      {/* Trust / Features Section */}
      <TrustSection />

      {/* Spacing gap */}
      <div className="h-2 bg-white" aria-hidden="true" />

      {/* Listings Section */}
      <section id="listings" className="py-12 sm:py-28 bg-surface scroll-mt-20 flex justify-center w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Hectare{" "}
                <span className="gradient-text">disponibile</span>
              </h2>
              <p className="text-sm text-muted mt-2">
                {startItem}-{endItem} din {totalItems} hectare
              </p>
            </div>
            <Link
              href="/hectare"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all group/btn sm:mr-5"
            >
              <span>Vezi toate hectarele</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <LandFilters filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Grid */}
          {filteredLands.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedLands.map((land, index) => (
                  <LandCard key={land.id} land={land} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-20">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 mx-auto">
                <Search className="w-8 h-8 text-muted/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Niciun hectar găsit
              </h3>
              <p className="text-muted text-center max-w-sm mx-auto">
                Nu am găsit hectare care să corespundă filtrelor tale. Încearcă să schimbi criteriile de căutare.
              </p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-6 px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10 cursor-pointer active:scale-95"
              >
                Resetează filtrele
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
