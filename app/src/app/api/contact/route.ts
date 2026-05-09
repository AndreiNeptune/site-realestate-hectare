import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validations/leads";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
    const body = await request.json();
    const { elapsedTime, ...formData } = body;

    // 1. Shadow Rejection (Behavioral Security)
    if (elapsedTime && elapsedTime < 3000) {
      console.log(`[Shadow Reject Contact] IP: ${ip}, Time: ${elapsedTime}ms`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Zod Validation & Sanitization
    const validation = leadSchema.safeParse(formData);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { nume_client, telefon, email, mesaj } = validation.data;

    const supabase = await createClient();

    // 3. IP-Based Rate Limiting (5 attempts per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("rate_limit_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gt("created_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit check error:", countError);
    }

    if (count !== null && count >= 5) {
      return NextResponse.json(
        { error: "Prea multe încercări. Vă rugăm să reveniți peste o oră." },
        { status: 429 }
      );
    }

    // 4. Final Truncation & Database Insertion
    const { error: insertError } = await supabase
      .from("leads")
      .insert({
        nume_client: nume_client.slice(0, 70),
        telefon: telefon.slice(0, 20),
        email: email ? email.slice(0, 100) : null,
        mesaj: mesaj.slice(0, 500),
        status_contact: 'nou'
      });

    if (insertError) {
      console.error("Contact insertion error:", insertError);
      return NextResponse.json(
        { error: "Eroare la trimiterea mesajului." },
        { status: 500 }
      );
    }

    // 5. Log attempt for rate limiting
    await supabase
      .from("rate_limit_attempts")
      .insert({ ip_address: ip });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Eroare internă a serverului." },
      { status: 500 }
    );
  }
}
