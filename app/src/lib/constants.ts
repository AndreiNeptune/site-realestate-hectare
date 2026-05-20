// ============================================================
// Constante globale ale aplicației
// ============================================================

export const SITE_NAME = "HectarExpert";
export const SITE_DESCRIPTION =
  "Platforma #1 din România pentru vânzarea și cumpărarea de hectare. Rezidențial, Industrial, Agricol, Pășune sau Fermă.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Lista județelor din România (pentru filtre/dropdown)
export const JUDETE = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud",
  "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin",
  "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj",
  "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița",
  "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț",
  "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava",
  "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea",
] as const;

// Tipuri de proprietate cu label-uri pentru UI
export const TIP_HECTAR_OPTIONS = [
  { value: "rezidential", label: "Rezidențial" },
  { value: "industrial", label: "Industrial" },
  { value: "agricol", label: "Agricol" },
  { value: "pasune", label: "Pășune" },
  { value: "ferma", label: "Fermă" },
] as const;

// Status-uri hectar cu label-uri și culori pentru UI
export const STATUS_HECTAR_OPTIONS = [
  { value: "disponibil", label: "Disponibil", color: "green" },
  { value: "rezervat", label: "Rezervat", color: "amber" },
  { value: "vandut", label: "Vândut", color: "red" },
] as const;

// Status-uri contact cu label-uri pentru UI admin
export const STATUS_CONTACT_OPTIONS = [
  { value: "nou", label: "Nou" },
  { value: "contactat", label: "Contactat" },
  { value: "in_discutie", label: "În discuție" },
  { value: "finalizat", label: "Finalizat" },
  { value: "anulat", label: "Anulat" },
] as const;

// Paginare
export const ITEMS_PER_PAGE = 12;

// Filter Limits
export const PRET_MAX_LIMIT = 500000;
export const SUPRAFATA_MAX_LIMIT = 100000;
