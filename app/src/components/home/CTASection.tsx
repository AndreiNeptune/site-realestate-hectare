"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-10 sm:py-24 bg-surface site-section-flex">
      <div className="site-main-container">
        <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light rounded-2xl sm:rounded-[2rem] px-6 sm:px-14 py-10 sm:py-20 text-center overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[100px]" />

          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 mb-8">
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                Listare gratuită
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
              Ai un hectar de vânzare?
            </h2>
            <p className="text-sm sm:text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
              Listează-l gratuit pe platforma noastră și ajunge la mii de
              potențiali cumpărători din toată România.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-primary-dark text-sm font-black rounded-xl hover:bg-accent-light transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 group"
              >
                <span>Listează Gratuit</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/despre-noi"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/15 hover:bg-white/20 hover:border-white/25 transition-all duration-300"
              >
                Află Mai Multe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
