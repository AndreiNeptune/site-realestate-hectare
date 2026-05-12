// ============================================================
// Tipuri TypeScript - oglindesc schema SQL
// ============================================================

export type TipHectar = "rezidential" | "industrial" | "agricol" | "pasune";

export type StatusHectar = "disponibil" | "rezervat" | "vandut";

export type StatusContact = "nou" | "contactat" | "in_discutie" | "finalizat" | "anulat";

// Tipul complet pentru un hectar (folosit generic în cod, label-at 'Hectar' în UI)
export interface Land {
  id: string;
  created_at: string;
  updated_at: string;
  titlu: string;
  descriere: string | null;
  pret: number;
  suprafata_mp: number;
  localitate: string;
  judet: string;
  tip_hectar: TipHectar;
  tip_teren?: string; // Fallback temporar pentru build-ul din Netlify cache
  latitudine: number | null;
  longitudine: number | null;
  imagini: string[];
  status: StatusHectar;
  has_curent: boolean;
  has_apa: boolean;
  has_gaz: boolean;
  has_canalizare: boolean;
}

// Tipul pentru crearea unui hectar nou (fără id și timestamps)
export interface LandInsert {
  titlu: string;
  descriere?: string;
  pret: number;
  suprafata_mp: number;
  localitate: string;
  judet: string;
  tip_hectar: TipHectar;
  latitudine?: number;
  longitudine?: number;
  imagini?: string[];
  status?: StatusHectar;
  has_curent?: boolean;
  has_apa?: boolean;
  has_gaz?: boolean;
  has_canalizare?: boolean;
}

// Tipul pentru actualizarea unui hectar (toate câmpurile opționale)
export type LandUpdate = Partial<LandInsert>;

// Tipul complet pentru un lead
export interface Lead {
  id: string;
  created_at: string;
  land_id: string;
  nume_client: string;
  telefon: string;
  email: string | null;
  mesaj: string | null;
  status_contact: StatusContact;
}

// Tipul pentru crearea unui lead nou
export interface LeadInsert {
  land_id: string;
  nume_client: string;
  telefon: string;
  email?: string;
  mesaj?: string;
}

// Lead cu informațiile hectarului asociat (join)
export interface LeadWithLand extends Lead {
  lands: Pick<Land, "id" | "titlu" | "localitate" | "judet">;
}

// Filtre pentru căutare hectare
export interface LandFilters {
  judet?: string;
  localitate?: string;
  tip_hectar?: TipHectar;
  status?: StatusHectar;
  pret_min?: number;
  pret_max?: number;
  suprafata_min?: number;
  suprafata_max?: number;
  sortare?: "pret_asc" | "pret_desc" | "suprafata_asc" | "suprafata_desc" | "recent";
}
