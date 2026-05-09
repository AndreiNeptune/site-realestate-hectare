"use client";

import { ShieldCheck, TrendingUp, MapPinned } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Verificate Legal",
    description:
      "Documentație 100% verificată juridic. Zero surprize la notar — tranzacții sigure, de la A la Z.",
    accent: "from-emerald-500 to-emerald-600",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-600",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Prețuri Corecte",
    description:
      "Evaluări bazate pe datele reale ale pieței. Transparență totală în fiecare tranzacție.",
    accent: "from-blue-500 to-blue-600",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-600",
  },
  {
    icon: <MapPinned className="w-7 h-7" />,
    title: "Localizare Exactă",
    description:
      "Coordonate GPS precise pentru fiecare parcelă. Vizualizare directă pe hartă satelit.",
    accent: "from-violet-500 to-violet-600",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-600",
  },
];

export default function TrustSection() {
  return (
    <section className="py-12 sm:pt-32 sm:pb-36 bg-white flex justify-center w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4 sm:mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">
              De ce HectarExpert
            </span>
          </div>
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-2 sm:mb-8">
            Investiții sigure,{" "}
            <span className="gradient-text">fără surprize</span>
          </h2>
          <div className="flex flex-col items-center justify-center min-h-[40px] sm:min-h-[60px]">
            <p className="text-xs sm:text-lg text-muted max-w-2xl leading-relaxed text-center">
              Fiecare hectar de pe platformă trece printr-un proces riguros de verificare.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-4 sm:p-10 rounded-2xl sm:rounded-3xl bg-surface border border-border/60 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 flex sm:flex-col items-start gap-4 sm:gap-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 shrink-0 ${feature.accentBg} ${feature.accentText} rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                {/* Responsive icon size */}
                <div className="scale-75 sm:scale-100">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base sm:text-xl font-extrabold text-foreground mb-1 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-base text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-bl-[3rem] rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
