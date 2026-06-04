import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, MapPin, Euro, Trees, MoreVertical, Edit } from 'lucide-react'
import { DeleteHectarButton } from './DeleteHectarButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminHectarePage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  const pageSize = 10
  const currentPage = parseInt(searchParams?.page || '1')
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  // Preia hectarele ordonate descendent
  const { data: hectare, error, count } = await supabase
    .from('lands')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = count ? Math.ceil(count / pageSize) : 0
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1
  
  const startItem = count === 0 ? 0 : from + 1
  const endItem = Math.min(currentPage * pageSize, count || 0)

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
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span>{startItem}-{endItem} din {count || 0} hectare</span>
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-medium">
              Pagina <span className="text-gray-900">{currentPage}</span> din <span className="text-gray-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/hectare?page=${currentPage - 1}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  hasPreviousPage
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    : 'bg-gray-50 border-gray-100 text-gray-300 pointer-events-none'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </Link>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={`/admin/hectare?page=${pageNum}`}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30 hover:bg-primary/5'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <Link
                href={`/admin/hectare?page=${currentPage + 1}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  hasNextPage
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    : 'bg-gray-50 border-gray-100 text-gray-300 pointer-events-none'
                }`}
              >
                <span>Următor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
