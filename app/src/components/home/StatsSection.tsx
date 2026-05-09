"use client";

import { CheckCircle, Map, Star, Clock } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  {
    icon: <CheckCircle className="w-6 h-6" />,
    value: 1200,
    suffix: "+",
    label: "Hectare verificate",
  },
  {
    icon: <Map className="w-6 h-6" />,
    value: 42,
    suffix: "",
    label: "Județe acoperite",
  },
  {
    icon: <Star className="w-6 h-6" />,
    value: 98,
    suffix: "%",
    label: "Clienți mulțumiți",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    value: 24,
    suffix: "h",
    label: "Timp mediu răspuns",
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-20 -mt-10 sm:-mt-16 flex justify-center w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl shadow-primary-dark/8 p-4 sm:p-8 lg:px-12 lg:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center justify-start gap-3 sm:gap-4 group mx-auto w-full max-w-[160px] sm:max-w-none ${
                  i < stats.length - 1
                    ? "sm:border-r sm:border-border/50 px-2 sm:px-4"
                    : "px-2 sm:px-4"
                }`}
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="flex flex-col items-start text-left">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2200}
                    className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight leading-none"
                  />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-muted uppercase tracking-[0.12em] mt-1.5 sm:whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
