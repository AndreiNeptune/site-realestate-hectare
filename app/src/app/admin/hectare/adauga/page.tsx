import { HectarForm } from '@/components/admin/HectarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdaugaHectarPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Adaugă Hectar Nou</h1>
          <p className="text-sm text-gray-500 mt-1">Completează formularul de mai jos pentru a publica un hectar.</p>
        </div>
      </div>

      <HectarForm />
    </div>
  )
}
