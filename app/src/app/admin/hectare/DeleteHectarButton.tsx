'use client'

import { useState, useTransition } from 'react'
import { Trash2, X, Check, Loader2 } from 'lucide-react'
import { deleteHectar } from './actions'

export function DeleteHectarButton({ hectarId }: { hectarId: string }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteHectar(hectarId)
      if (result.success) {
        setIsConfirming(false)
      } else {
        alert('Eroare la ștergere: ' + result.error)
        setIsConfirming(false)
      }
    })
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
        <span className="text-[11px] font-semibold text-red-600 whitespace-nowrap">Confirmă ștergerea?</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Confirmă"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => setIsConfirming(false)}
            disabled={isPending}
            className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-all active:scale-95"
            title="Renunță"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group" 
      title="Șterge"
    >
      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
    </button>
  )
}
