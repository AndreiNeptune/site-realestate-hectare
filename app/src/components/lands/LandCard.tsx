"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize, ArrowRight, Tag } from "lucide-react";
import type { Land } from "@/lib/types";

interface LandCardProps {
  land: Land;
  index?: number;
}

export default function LandCard({ land, index = 0 }: LandCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ro-RO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatArea = (area: number) =>
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(area);

  const formatPricePerSqm = (price: number, area: number) => {
    if (!area) return "0";
    return new Intl.NumberFormat("ro-RO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(price / area);
  };

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

  const staggerClass = index < 9 ? `stagger-${index + 1}` : "";

  return (
    <Link
      href={`/hectare/${land.id}`}
      className={`group block bg-white rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 opacity-0 animate-fade-in-up ${staggerClass}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={land.imagini?.[0] || "/placeholder-land.png"}
          alt={land.titlu}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Centered Badges Container */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 px-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              land.status === 'disponibil' ? 'bg-emerald-500 text-white' :
              land.status === 'rezervat' ? 'bg-amber-500 text-white' :
              'bg-red-500 text-white'
            } shadow-lg`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {statusLabels[land.status]}
          </span>

          {/* Type badge */}
          <span className="inline-flex items-center px-3 py-1 bg-white text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {land.tip_hectar}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <Tag className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-lg font-black text-primary tracking-tight">
              {formatPrice(land.pret)} €
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8 sm:p-10 pb-12">
        {/* Title */}
        <h3 className="text-lg font-black text-foreground leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
          {land.titlu}
        </h3>

        {/* Details */}
        <div className="flex items-center gap-5 mb-6 overflow-hidden">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted min-w-0">
            <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="text-[11px] font-bold truncate">
              {land.localitate}, {land.judet}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1.5 text-muted flex-shrink-0">
            <Maximize className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="text-[11px] font-bold whitespace-nowrap">
              {formatArea(land.suprafata_mp)} m²
            </span>
          </div>

          {/* Price per sqm */}
          <div className="flex items-center gap-1 text-muted flex-shrink-0 ml-auto border-l border-border/50 pl-4">
            <span className="text-[11px] font-bold whitespace-nowrap">
              {formatPricePerSqm(land.pret, land.suprafata_mp)} €/m²
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 mb-6" />

        {/* Price per sqm + CTA */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-3 text-accent group-hover:text-primary font-black transition-colors">
            <span className="text-xs uppercase tracking-widest">Detalii</span>
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
