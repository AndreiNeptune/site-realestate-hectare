'use client'

import { useTransition } from 'react'
import { updateLeadStatus } from './actions'

export function LeadStatusSelect({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    startTransition(async () => {
      await updateLeadStatus(leadId, newStatus)
    })
  }

  const getStatusColorCls = (status: string) => {
     switch(status) {
        case 'nou': return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'contactat': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'in_discutie': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
        case 'finalizat': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'anulat': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-gray-50 text-gray-700 border-gray-200'
     }
  }

  return (
    <div className="relative">
      <select
        disabled={isPending}
        value={currentStatus}
        onChange={handleChange}
        className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${getStatusColorCls(currentStatus)} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="nou">Nou</option>
        <option value="contactat">Contactat</option>
        <option value="in_discutie">În discuție</option>
        <option value="finalizat">Finalizat</option>
        <option value="anulat">Anulat</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  )
}
