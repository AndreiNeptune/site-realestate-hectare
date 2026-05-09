'use client'

import { useState } from 'react'
import { Mail, Phone, Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { LeadStatusSelect } from './LeadStatusSelect'

export function LeadRow({ lead }: { lead: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-blue-50/30' : ''}`}>
      <td className="px-4 py-3 align-top text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
            isExpanded 
              ? 'bg-primary/10 text-primary hover:bg-primary/20' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
          }`}
          title={isExpanded ? "Restrânge" : "Extinde pentru detalii complete"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </td>
      <td className="px-4 py-3 align-top">
        <div 
          className={`font-medium text-gray-900 break-words transition-all duration-300 ${!isExpanded ? 'max-w-[140px] truncate' : 'max-w-full'}`} 
          title={lead.nume_client}
        >
          {lead.nume_client}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className={`flex flex-col gap-1 text-gray-600 transition-all duration-300 ${!isExpanded ? 'max-w-[160px]' : 'max-w-full'}`}>
          {lead.telefon && (
            <div className={`flex items-center gap-1.5 break-all ${!isExpanded ? 'truncate' : ''}`} title={lead.telefon}>
              <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs">{lead.telefon}</span>
            </div>
          )}
          {lead.email && (
            <div className={`flex items-center gap-1.5 break-all ${!isExpanded ? 'truncate' : ''}`} title={lead.email}>
              <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs">{lead.email}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        {lead.lands ? (
          <Link 
            href={`/hectare/${lead.lands.id}`}
            target="_blank"
            className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group/link ${!isExpanded ? 'max-w-[180px]' : ''}`}
            title={`Vezi: ${lead.lands.titlu}`}
          >
            <span className={`text-xs ${!isExpanded ? 'truncate' : 'break-words'}`}>{lead.lands.titlu}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ) : (
          <div className="text-[11px] text-gray-400 italic">Formular contact</div>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <div 
          className={`break-words text-[11px] text-gray-600 leading-relaxed transition-all duration-300 ${!isExpanded ? 'max-w-[320px] line-clamp-2' : 'max-w-full'}`}
          title={lead.mesaj}
        >
          {lead.mesaj || <span className="text-gray-400 italic">Fără mesaj</span>}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div>
             <div className="text-gray-900 font-medium text-xs whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString('ro-RO')}</div>
             <div className="text-[10px] whitespace-nowrap">{new Date(lead.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right align-top">
        <div className="flex items-center justify-end gap-2">
          <LeadStatusSelect leadId={lead.id} currentStatus={lead.status_contact} />
        </div>
      </td>
    </tr>
  )
}
