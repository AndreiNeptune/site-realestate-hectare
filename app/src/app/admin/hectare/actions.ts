'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addHectar(formData: FormData) {
  const supabase = await createClient()

  const titlu = formData.get('titlu') as string
  const pret = parseFloat(formData.get('pret') as string)
  const suprafata = parseFloat(formData.get('suprafata') as string)
  const judet = formData.get('judet') as string
  const localitate = formData.get('localitate') as string
  const tip_hectar = formData.get('tip_hectar') as string
  const descriere = formData.get('descriere') as string
  const latString = formData.get('latitudine') as string
  const longString = formData.get('longitudine') as string
  
  const latitudine = latString ? parseFloat(latString) : undefined
  const longitudine = longString ? parseFloat(longString) : undefined
  
  // Imagini Upload - URLs pre-uploaded via client
  const imageUrlsString = formData.get('imageUrls') as string
  let imageUrls: string[] = []
  if (imageUrlsString) {
    try {
      imageUrls = JSON.parse(imageUrlsString)
    } catch (e) {
      console.error("Failed to parse imageUrls")
    }
  }

  const payload: any = {
    titlu,
    pret,
    suprafata_mp: suprafata,
    judet,
    localitate,
    tip_hectar,
    descriere,
    latitudine,
    longitudine,
    status: 'disponibil',
    has_curent: formData.get('has_curent') === 'on',
    has_apa: formData.get('has_apa') === 'on',
    has_gaz: formData.get('has_gaz') === 'on',
    has_canalizare: formData.get('has_canalizare') === 'on',
  }

  if (imageUrls.length > 0) {
    payload.imagini = imageUrls
  }

  const { error } = await supabase.from('lands').insert(payload)

  if (error) {
    console.error('Error adding hectar:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/hectare')
  revalidatePath('/admin/dashboard')
  revalidatePath('/hectare')
  revalidatePath('/')
  return { success: true }
}

export async function updateHectar(id: string, formData: FormData) {
  const supabase = await createClient()

  const titlu = formData.get('titlu') as string
  const pret = parseFloat(formData.get('pret') as string)
  const suprafata = parseFloat(formData.get('suprafata') as string)
  const judet = formData.get('judet') as string
  const localitate = formData.get('localitate') as string
  const tip_hectar = formData.get('tip_hectar') as string
  const status = formData.get('status') as string
  const descriere = formData.get('descriere') as string
  const latString = formData.get('latitudine') as string
  const longString = formData.get('longitudine') as string
  
  const latitudine = latString ? parseFloat(latString) : undefined
  const longitudine = longString ? parseFloat(longString) : undefined
  
  // Imagini Upload - URLs pre-uploaded via client
  const imageUrlsString = formData.get('imageUrls') as string
  const existingImageUrlsString = formData.get('existingImageUrls') as string
  
  let finalImageUrls: string[] = []
  
  // Start with existing images if they were kept
  if (existingImageUrlsString) {
    try {
      finalImageUrls = JSON.parse(existingImageUrlsString)
    } catch (e) {
      console.error("Failed to parse existingImageUrls")
    }
  }

  // Append new images
  if (imageUrlsString) {
    try {
      const newImageUrls = JSON.parse(imageUrlsString)
      finalImageUrls = [...finalImageUrls, ...newImageUrls]
    } catch (e) {
      console.error("Failed to parse imageUrls")
    }
  }

  const payload: any = {
    titlu,
    pret,
    suprafata_mp: suprafata,
    judet,
    localitate,
    tip_hectar,
    status,
    descriere,
    latitudine,
    longitudine,
    updated_at: new Date().toISOString(),
    has_curent: formData.get('has_curent') === 'on',
    has_apa: formData.get('has_apa') === 'on',
    has_gaz: formData.get('has_gaz') === 'on',
    has_canalizare: formData.get('has_canalizare') === 'on',
  }

  if (finalImageUrls.length > 0) {
    payload.imagini = finalImageUrls
  }

  const { error } = await supabase.from('lands').update(payload).eq('id', id)

  if (error) {
    console.error('Error updating hectar:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/hectare')
  revalidatePath('/admin/dashboard')
  revalidatePath(`/hectare/${id}`)
  revalidatePath('/hectare')
  revalidatePath('/')
  
  return { success: true }
}

export async function deleteHectar(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('lands').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting hectar:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/hectare')
  revalidatePath('/admin/dashboard')
  revalidatePath('/hectare')
  revalidatePath('/')

  return { success: true }
}
