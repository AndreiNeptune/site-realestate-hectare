import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 0; // Disable cache for debugging

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lands")
    .select("*")
    .eq("status", "disponibil")
    .order("created_at", { ascending: false });

  return <HomeClient initialLands={data || []} />;
}
