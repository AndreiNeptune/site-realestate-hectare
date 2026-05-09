import { createClient } from '@/lib/supabase/server'
import { HectarForm } from '@/components/admin/HectarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditeazaHectarPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hectar, error } = await supabase
    .from('lands')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !hectar) {
    console.error('Error fetching hectar for edit:', error)
    return notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/hectare"
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Editează Hectar</h1>
          <p className="text-sm text-gray-500 mt-1">Modifică detaliile anunțului existent.</p>
        </div>
      </div>

      <HectarForm initialData={hectar} />
    </div>
  )
}
