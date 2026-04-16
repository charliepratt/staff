import { Check } from 'lucide-react'

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved'
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {status === 'saving' && (
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
      {status === 'saved' && (
        <Check size={12} className="text-success" />
      )}
      <span className="text-text-3">
        {status === 'saving' ? 'Saving' : 'Saved'}
      </span>
    </div>
  )
}
