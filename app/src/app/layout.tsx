import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HectarExpert — Investiții Inteligente în Hectare",
  description:
    "Platforma #1 din România pentru vânzarea și cumpărarea de hectare. Rezidențial, Industrial, Agricol, Pășune sau Fermă.",
  keywords: [
    "hectare de vanzare",
    "hectare rezidential",
    "hectare industrial",
    "hectare agricol",
    "pasune de vanzare",
    "hectare ferma",
    "ferma de vanzare",
    "hectar romania",
  ],
  openGraph: {
    title: "HectarExpert — Investiții Inteligente în Hectare",
    description:
      "Găsește hectarul perfect pentru tine. Filtrează după județ, preț, suprafață și tip de hectar.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
