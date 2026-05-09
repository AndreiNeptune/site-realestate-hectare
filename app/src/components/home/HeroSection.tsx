"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onJudetChange: (judet: string) => void;
  onTipHectarChange?: (tipHectar: string) => void;
  onBudgetChange?: (budget: number) => void;
}

export default function HeroSection({
  onSearch,
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <section className="relative min-h-[420px] sm:min-h-[800px] lg:min-h-[900px] flex flex-col bg-slate-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-hectare.png"
          alt="Field of hectares"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary/40 to-primary-dark/80" />
      </div>

      {/* Background patterns & orbs */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-48 left-[10%] w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-48 right-[8%] w-80 h-80 bg-primary-light/20 rounded-full blur-[120px] animate-pulse-glow" />

      {/* Hero Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-8 sm:pt-32 pb-10 sm:pb-32 lg:pb-40 px-6 sm:px-10 lg:px-16 w-full text-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col items-center">
            {/* Badge - hidden on mobile for compactness */}
            <div className="hidden sm:inline-flex items-center gap-2 premium-badge bg-white/[0.07] backdrop-blur-sm rounded-full border border-white/10 mb-6 sm:mb-10 animate-fade-in shadow-lg py-1.5 sm:py-2.5 px-6 sm:px-8">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold text-white/80 tracking-wider uppercase">
                ✦ Peste 1.200 hectare verificate
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.2] tracking-tight mb-2 sm:mb-6 animate-fade-in-up">
              Investește inteligent
              <br />
              <span className="relative">
                în hectarul{" "}
                <span className="gradient-text">potrivit</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-xs sm:text-lg lg:text-xl text-white/55 leading-relaxed mb-6 sm:mb-24 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Descoperă oferte verificate legal din toată România.
              <br className="hidden sm:block" />
              Transparent, sigur, rapid.
            </p>

            {/* ============== Minimalist Search Bar ============== */}
            <div
              className="relative z-40 w-full max-w-3xl animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="search-bar-v2 !p-2 sm:!p-3 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 text-left">
                  <div className="flex-1">
                    <SearchInput
                      label="Căutare"
                      value={searchQuery}
                      onChange={(val) => setSearchQuery(val)}
                      onEnter={handleSearch}
                      placeholder="Cuvânt cheie (ex: Snagov, Agricol...)"
                      icon={<Search className="w-5 h-5" />}
                      hideBorder={true}
                    />
                  </div>

                  {/* Search Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleSearch}
                      className="flex items-center justify-center h-[52px] sm:h-[64px] px-6 sm:px-10 bg-primary-dark text-white rounded-xl sm:rounded-2xl hover:bg-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary-dark/20 cursor-pointer group active:scale-95 shadow-md gap-2 sm:gap-3"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Caută</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          className="w-full h-auto block translate-y-[1px] scale-y-[1.1] origin-bottom"
          preserveAspectRatio="none"
        >
          <path
            d="M0 70V28C180 52 360 8 540 22C720 36 900 56 1080 32C1260 8 1380 42 1440 38V70H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
