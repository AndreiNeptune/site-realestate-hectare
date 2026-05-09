import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileNav from '@/components/admin/AdminMobileNav'

// Putem folosi cache de la react pentru a face cereri de Supabase într-un server component
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll() {} // SetAll e stors din middleware, aici avem DOAR acces la session read.
    }
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminMobileNav user={user} />
      
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0">
        <AdminSidebar user={user} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
         <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
         </div>
      </main>
    </div>
  )
}
