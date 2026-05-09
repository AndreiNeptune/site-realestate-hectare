'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update({ status_contact: newStatus })
    .eq('id', leadId)

  if (error) {
    console.error('Eroare la actualizarea lead-ului:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin/dashboard')
  
  return { success: true }
}
