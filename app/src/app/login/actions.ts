'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Dacă credențialele sunt incorecte
  if (error) {
    return redirect('/login?message=Email sau parolă incorecte')
  }

  // Middleware-ul nostru se va ocupa de securizarea și direcționarea în caz că nu e admin
  return redirect('/admin/dashboard')
}
