import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lands")
    .select("*")
    .eq("status", "disponibil")
    .order("created_at", { ascending: false });

  return <HomeClient initialLands={data || []} />;
}
