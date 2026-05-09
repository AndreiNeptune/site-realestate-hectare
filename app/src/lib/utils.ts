/**
 * Formatare preț în format românesc (ex: 45.000 €)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " €";
}

/**
 * Formatare suprafață (ex: 1.500 mp)
 */
export function formatArea(area: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(area) + " mp";
}

/**
 * Formatare dată în format românesc (ex: 10 aprilie 2026)
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Generează un slug SEO-friendly dintr-un titlu
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimină diacriticele
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Calculează prețul per metru pătrat
 */
export function pricePerSqm(price: number, area: number): string {
  if (area === 0) return "N/A";
  return formatPrice(Math.round(price / area)) + "/mp";
}

/**
 * Trunchiază un text la un număr maxim de caractere
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
