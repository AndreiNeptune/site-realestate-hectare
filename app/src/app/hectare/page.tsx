import { createClient } from "@/lib/supabase/server";
import HectareClient from "./HectareClient";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HectareListingPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lands")
    .select("*")
    .eq("status", "disponibil")
    .order("created_at", { ascending: false });

  return <HectareClient initialLands={data || []} />;
}
