import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/lands - Listare hectare cu filtre și paginare
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    let query = supabase.from("lands").select("*", { count: "exact" });

    // Filtre
    const judet = searchParams.get("judet");
    const tip_hectar = searchParams.get("tip_hectar");
    const status = searchParams.get("status") || "disponibil";
    const pret_min = searchParams.get("pret_min");
    const pret_max = searchParams.get("pret_max");
    const suprafata_min = searchParams.get("suprafata_min");
    const suprafata_max = searchParams.get("suprafata_max");

    if (judet) query = query.eq("judet", judet);
    if (tip_hectar) query = query.eq("tip_hectar", tip_hectar);
    if (status) query = query.eq("status", status);
    if (pret_min) query = query.gte("pret", Number(pret_min));
    if (pret_max) query = query.lte("pret", Number(pret_max));
    if (suprafata_min) query = query.gte("suprafata_mp", Number(suprafata_min));
    if (suprafata_max) query = query.lte("suprafata_mp", Number(suprafata_max));

    // Sortare
    const sortare = searchParams.get("sortare") || "recent";
    switch (sortare) {
      case "pret_asc":
        query = query.order("pret", { ascending: true });
        break;
      case "pret_desc":
        query = query.order("pret", { ascending: false });
        break;
      case "suprafata_asc":
        query = query.order("suprafata_mp", { ascending: true });
        break;
      case "suprafata_desc":
        query = query.order("suprafata_mp", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // Paginare
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Eroare la interogare HectarExpert:", error);
      return NextResponse.json(
        { error: "Eroare la încărcarea hectarelor." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Eroare internă a serverului." },
      { status: 500 }
    );
  }
}
