import { createClient } from '@/lib/supabase/server'
import { LeadRow } from './LeadRow'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { page?: string }
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  
  const pageSize = 10
  const currentPage = parseInt(searchParams.page || '1')
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  // Preia lead-urile paginate, ordonate după data adăugării
  const { data: leads, error, count } = await supabase
    .from('leads')
    .select('*, lands(titlu, id)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching leads:', error)
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Management Contacte</h1>
          <p className="text-sm text-gray-500 mt-1">Gestionează cererile și lead-urile primite pe platformă.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span>Total: {count || 0} contacte</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 px-4 py-3 font-medium text-gray-500 text-center">#</th>
                <th className="px-4 py-3 font-medium text-gray-500">Client</th>
                <th className="px-4 py-3 font-medium text-gray-500">Contact</th>
                <th className="px-4 py-3 font-medium text-gray-500">Hectar de interes</th>
                <th className="px-4 py-3 font-medium text-gray-500">Mesaj</th>
                <th className="px-4 py-3 font-medium text-gray-500">Dată / Oră</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Status & Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads && leads.length > 0 ? (
                leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 bg-gray-50/30 font-medium italic">
                    Nu a fost găsit niciun contact în baza de date.
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
                href={`/admin/leads?page=${currentPage - 1}`}
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
                  // Show current page, first, last, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={`/admin/leads?page=${pageNum}`}
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
                  // Show ellipses
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <Link
                href={`/admin/leads?page=${currentPage + 1}`}
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
