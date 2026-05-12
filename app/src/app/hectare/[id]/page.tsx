import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import HectarDetaliiClient from "./HectarDetaliiClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

// Generează metadata SEO dinamică
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: land } = await supabase.from("lands").select("*").eq("id", id).single();

  if (!land) {
    return { title: "Hectar negăsit — HectarExpert" };
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ro-RO").format(price);

  return {
    title: `${land.titlu} — ${formatPrice(land.pret)} € | HectarExpert`,
    description: `${land.titlu} în ${land.localitate}, ${land.judet}. ${formatPrice(land.suprafata_mp)} ha, ${formatPrice(land.pret)} €. Tip: ${land.tip_hectar}.`,
    openGraph: {
      title: land.titlu,
      description: `Hectar de vânzare în ${land.localitate}, ${land.judet} — ${formatPrice(land.pret)} €`,
      images: land.imagini?.[0] ? [land.imagini[0]] : [],
    },
  };
}

export default async function HectarDetaliiPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: land } = await supabase.from("lands").select("*").eq("id", id).single();

  if (!land) {
    notFound();
  }

  return <HectarDetaliiClient land={land} />;
}
