import { Check } from 'lucide-react'

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved'
}

const savedMessages = [
  'Saved',
  'All safe',
  'Tucked away',
  'Saved',
  'Safe and sound',
  'Saved',
]

let messageIndex = 0
function getNextSavedMessage(): string {
  const msg = savedMessages[messageIndex % savedMessages.length]!
  messageIndex++
  return msg
}

let currentMessage = 'Saved'

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'saving') {
    currentMessage = getNextSavedMessage()
  }

  if (status === 'idle') return null

  return (
    <div className="flex items-center gap-1.5 text-xs transition-opacity duration-300">
      {status === 'saving' && (
        <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse" />
      )}
      {status === 'saved' && (
        <Check size={12} className="text-success" strokeWidth={2.5} />
      )}
      <span className="text-text-3">
        {status === 'saving' ? 'Saving' : currentMessage}
      </span>
    </div>
  )
}
