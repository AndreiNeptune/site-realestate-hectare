import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verifică starea autentificării
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (user && isAdminRoute) {
    // Dacă e logat, verifică dacă este admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      // Dacă nu are rol de admin, direcționează-l spre prima pagină
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAdminRoute && !user) {
    // Dacă încearcă să acceseze /admin dar nu e logat
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isLoginPage) {
    // Preluăm rolul pt a direcționa corect dacă încearcă să acceseze /login dar e deja logat
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
       return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}
