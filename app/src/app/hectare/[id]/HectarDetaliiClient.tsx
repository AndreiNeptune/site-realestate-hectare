"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Maximize,
  Tag,
  Calendar,
  Layers,
  Zap,
  Droplets,
  Flame,
  Globe,
  Share2,
  Printer,
  Phone,
} from "lucide-react";
import type { Land } from "@/lib/types";
import ImageGallery from "@/components/lands/ImageGallery";
import LeadForm from "@/components/forms/ContactForm";

import { useState, useEffect } from "react";

interface Props {
  land: Land;
}

export default function HectarDetaliiClient({ land }: Props) {
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showCopyToast) {
      const timer = setTimeout(() => setShowCopyToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCopyToast]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ro-RO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatArea = (area: number) =>
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(area / 10000);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));

  const pricePerSqm = Math.round(land.pret / land.suprafata_mp);

  const statusColors: Record<string, string> = {
    disponibil: "bg-emerald-500",
    rezervat: "bg-amber-500",
    vandut: "bg-red-500",
  };

  const statusLabels: Record<string, string> = {
    disponibil: "Disponibil",
    rezervat: "Rezervat",
    vandut: "Vândut",
  };



  // Specs data
  const specs = [
    {
      icon: <Maximize className="w-5 h-5" />,
      label: "Suprafață",
      value: `${formatArea(land.suprafata_mp)} ha`,
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Tip proprietate",
      value: {
        rezidential: "Rezidențial",
        industrial: "Industrial",
        agricol: "Agricol",
        pasune: "Pășune",
      }[land.tip_hectar] || land.tip_hectar,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Localitate",
      value: land.localitate,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Județ",
      value: land.judet,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Publicat la",
      value: formatDate(land.created_at),
    },
  ];

  // Utilities from Database
  const utilities = [
    { icon: <Zap className="w-4 h-4" />, label: "Curent electric", available: land.has_curent },
    { icon: <Droplets className="w-4 h-4" />, label: "Apă curentă", available: land.has_apa },
    { icon: <Flame className="w-4 h-4" />, label: "Gaz natural", available: land.has_gaz },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      label: "Canalizare",
      available: land.has_canalizare,
    },
  ];

  const handleShare = async () => {
    const shareData = {
      title: land.titlu,
      text: `HectarExpert: ${land.titlu} — ${formatPrice(land.pret)} €`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopyToast(true);
      }
    } catch (err) {
      // Fallback if sharing is cancelled or fails
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopyToast(true);
      }
    }
  };

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border site-section-flex">
        <div className="site-main-container py-4">
          <div className="flex items-center gap-2 text-xs text-muted overflow-hidden">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
              Acasă
            </Link>
            <span className="flex-shrink-0">/</span>
            <Link href="/hectare" className="hover:text-primary transition-colors flex-shrink-0">
              Hectare
            </Link>
            <span className="flex-shrink-0">/</span>
            <span className="text-foreground font-medium truncate">
              {land.titlu}
            </span>
          </div>
        </div>
      </div>

      <div className="site-main-container py-8 sm:py-16">
        {/* Back button + Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span>Înapoi la listare</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-muted bg-surface rounded-lg border border-border hover:text-primary hover:border-primary/20 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Distribuie</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-muted bg-surface rounded-lg border border-border hover:text-primary hover:border-primary/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Printează</span>
            </button>
          </div>
        </div>

        {/* Main Layout: 2 column on desktop */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Title + Status + Price */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white uppercase tracking-wider ${statusColors[land.status]}`}
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse flex-shrink-0" />
                  {statusLabels[land.status]}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-surface rounded-lg text-[11px] font-bold text-primary uppercase tracking-wider border border-border">
                  {land.tip_hectar}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                {land.titlu}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="font-medium">
                    {land.localitate}, {land.judet}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-primary/50 flex-shrink-0" />
                  <span className="font-medium">
                    {formatArea(land.suprafata_mp)} ha
                  </span>
                </div>
              </div>

              {/* Price highlight */}
              <div className="mt-5 inline-flex items-center gap-3 px-5 py-3.5 bg-primary/5 rounded-2xl border border-primary/10">
                <Tag className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-2xl font-extrabold text-primary tracking-tight">
                  {formatPrice(land.pret)} €
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-12">
              <ImageGallery images={land.imagini} title={land.titlu} />
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Descriere
              </h2>
              <div className="space-y-6">
                {land.descriere?.split("\n\n").map((chunk, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base text-muted leading-relaxed"
                  >
                    {chunk.split("\n").map((line, j) => (
                      <span key={j} className="block mb-2 last:mb-0">
                        {line}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Specificații tehnice
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center gap-4 p-5 bg-surface rounded-xl border border-border"
                  >
                    <div className="w-10 h-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      {spec.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-0.5">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-foreground truncate">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Utilități
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {utilities.map((util) => (
                  <div
                    key={util.label}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                      util.available
                        ? "bg-emerald-50/50 border-emerald-200/50 text-emerald-700"
                        : "bg-surface border-border text-muted-light"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        util.available
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-border/50 text-muted-light"
                      }`}
                    >
                      {util.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{util.label}</p>
                      <p className={`text-[11px] font-medium mt-0.5 ${util.available ? "text-emerald-500" : "text-muted-light"}`}>
                        {util.available ? "Disponibil" : "Indisponibil"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* Right Column - Sticky Lead Form */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Lead Form */}
              <LeadForm landId={land.id} landTitle={land.titlu} />

              {/* Quick Contact */}
              <div className="bg-surface rounded-2xl border border-border p-5">
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                  Sau sună direct
                </p>
                <a
                  href="tel:+40700000000"
                  className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      0700 000 000
                    </p>
                    <p className="text-[11px] text-muted font-medium mt-0.5">
                      Luni - Vineri, 09:00 - 18:00
                    </p>
                  </div>
                </a>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50/50 rounded-2xl border border-amber-200/50 p-5">
                <p className="text-xs font-bold text-amber-800 mb-3">
                  🛡️ Sfaturi de siguranță
                </p>
                <ul className="space-y-3">
                  {[
                    "Verifică documentele de proprietate",
                    "Vizitează hectarul personal",
                    "Consultă un notar înainte de tranzacție",
                    "Nu transfera bani fără contract",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="text-[11px] text-amber-700 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-amber-400 mt-px flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${
          showCopyToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-primary-dark text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Share2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">Link copiat în clipboard!</span>
        </div>
      </div>
    </>
  );
}
