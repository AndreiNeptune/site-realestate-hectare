"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Menu, X, Phone, Plus } from "lucide-react";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/hectare", label: "Hectare" },
  { href: "/despre-noi", label: "Despre Noi" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The header should be dynamic (transparent -> solid) ONLY on the home page and hectare list
  const isDynamicPage = pathname === "/" || pathname === "/hectare";
  
  // Use the "solid" look if scrolled OR if we are on any other page
  const isSolid = scrolled || !isDynamicPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid
          ? "bg-white/95 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="site-main-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                isSolid
                  ? "bg-primary group-hover:bg-primary-light"
                  : "bg-white/10 backdrop-blur-sm border border-white/15 group-hover:bg-white/20"
              }`}
            >
              <MapPin className={`w-5 h-5 transition-colors ${isSolid ? "text-white" : "text-white"}`} />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-lg font-bold leading-tight tracking-tight transition-colors duration-300 ${
                  isSolid ? "text-primary" : "text-white"
                }`}
              >
                Hectar
                <span className="text-accent">Expert</span>
              </span>
              <span
                className={`text-[10px] font-medium -mt-0.5 hidden sm:block transition-colors duration-300 ${
                  isSolid ? "text-muted" : "text-white/50"
                }`}
              >
                HECTARE DE VÂNZARE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isSolid
                    ? "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <a
              href="tel:+40742044077"
              className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isSolid
                  ? "text-muted hover:text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>0742 044 077</span>
            </a>

            <Link
              href="/contact"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 whitespace-nowrap ${
                isSolid
                  ? "bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg"
                  : "bg-white text-primary hover:bg-white/90 shadow-lg"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Adaugă Anunț</span>
            </Link>

          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2.5 rounded-xl transition-all cursor-pointer ${
              isSolid
                ? "text-foreground/70 hover:text-primary hover:bg-surface"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-xl animate-slide-down">
          <div className="px-5 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-surface rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border mt-3 space-y-3">
              <a
                href="tel:+40742044077"
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-muted"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>0742 044 077</span>
              </a>

              <div className="px-4 pb-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adaugă Anunț</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
