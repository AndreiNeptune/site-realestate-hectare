import { createClient } from '@/lib/supabase/server'
import { Map, Users, CheckCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Preia total hectare
  const { count: totalHectare } = await supabase
    .from('lands')
    .select('*', { count: 'exact', head: true })

  // Preia hectare active (disponibile)
  const { count: hectareActive } = await supabase
    .from('lands')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disponibil')

  // Preia lead-uri noi
  const { count: leaduriNoi } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status_contact', 'nou')

  // Ultimele Lead-uri apărute
  const { data: latestLeads } = await supabase
    .from('leads')
    .select('*, lands(titlu)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      title: 'Total Hectare',
      value: totalHectare || 0,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Hectare Active',
      value: hectareActive || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Lead-uri Noi',
      value: leaduriNoi || 0,
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Bine ai venit în panoul de control HectarExpert.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.color}`}>
               <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Ultimele Contacte (Leads)</h2>
           </div>
           <div className="divide-y divide-gray-100">
              {latestLeads && latestLeads.length > 0 ? (
                 latestLeads.map(lead => (
                   <div key={lead.id} className="p-6 flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-medium">
                        {lead.nume_client.charAt(0)}
                     </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{lead.nume_client}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{lead.lands?.titlu}</p>
                        <div className="flex items-center gap-2 mt-2">
                           {lead.status_contact === 'nou' && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                               Nou
                             </span>
                           )}
                           {lead.status_contact === 'contactat' && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                               Contactat
                             </span>
                           )}
                           {lead.status_contact === 'in_discutie' && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                               În discuție
                             </span>
                           )}
                           {lead.status_contact === 'finalizat' && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                               Finalizat
                             </span>
                           )}
                           {lead.status_contact === 'anulat' && (
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                               Anulat
                             </span>
                           )}
                           <span className="text-xs text-gray-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" />
                             {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                           </span>
                        </div>
                      </div>
                   </div>
                 ))
              ) : (
                 <div className="p-8 text-center text-gray-500 text-sm">
                   Nu există lead-uri momentan.
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
