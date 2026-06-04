import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, MapPin, Euro, Trees, MoreVertical, Edit } from 'lucide-react'
import { DeleteHectarButton } from './DeleteHectarButton'

export const dynamic = 'force-dynamic'

export default async function AdminHectarePage() {
  const supabase = await createClient()

  // Preia hectarele ordonate descendent
  const { data: hectare, error } = await supabase
    .from('lands')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lands:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Hectare</h1>
          <p className="text-sm text-gray-500 mt-1">Gestionează portofoliul de oferte disponibile pe platformă.</p>
        </div>
        <Link 
          href="/admin/hectare/adauga"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Adaugă hectar
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500">Detalii Hectar</th>
                <th className="px-6 py-4 font-medium text-gray-500">Locație & Tip</th>
                <th className="px-6 py-4 font-medium text-gray-500">Preț</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hectare && hectare.length > 0 ? (
                hectare.map((hectar) => (
                  <tr key={hectar.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                           {hectar.imagini && hectar.imagini.length > 0 ? (
                             <img src={hectar.imagini[0]} alt={hectar.titlu} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Trees className="w-5 h-5" />
                             </div>
                           )}
                        </div>
                        <div className="flex-col min-w-0">
                          <div className="font-medium text-gray-900 truncate max-w-[200px]" title={hectar.titlu}>
                            {hectar.titlu}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                             <Trees className="w-3.5 h-3.5 text-gray-400" />
                             {hectar.suprafata_mp.toLocaleString('ro-RO')} mp
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-gray-700">
                             <MapPin className="w-3.5 h-3.5 text-gray-400" />
                             <span className="truncate max-w-[150px]">{hectar.localitate}, {hectar.judet}</span>
                          </div>
                          <span className="inline-flex w-fit px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium uppercase tracking-wider">
                             {(hectar.tip_hectar).replace('_', ' ')}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          <Euro className="w-3.5 h-3.5 text-gray-500" />
                          {hectar.pret.toLocaleString('ro-RO')} €/mp
                        </div>
                        <div className="text-xs text-gray-500">
                          Total: {(hectar.pret * hectar.suprafata_mp).toLocaleString('ro-RO')} €
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       {hectar.status === 'disponibil' && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Disponibil</span>}
                       {hectar.status === 'rezervat' && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Rezervat</span>}
                       {hectar.status === 'vandut' && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">Vândut</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link 
                           href={`/admin/hectare/editeaza/${hectar.id}`}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                           title="Editează"
                         >
                           <Edit className="w-4 h-4" />
                         </Link>
                         <DeleteHectarButton hectarId={hectar.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-gray-50/30">
                    Nu s-a găsit niciun hectar în baza de date. 
                    <div className="mt-2 text-blue-600 hover:underline">
                      <Link href="/admin/hectare/adauga">Adaugă unul acum.</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
