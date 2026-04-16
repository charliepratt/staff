import { useState } from 'react'
import { TooltipProvider } from './ui/Tooltip'
import { ScreenplayEditor } from './components/ScreenplayEditor'
import { PenLine } from 'lucide-react'

export default function App() {
  const [zoom, setZoom] = useState(1.25)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full bg-surface-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border-1 bg-surface-1">
          <div className="flex items-center gap-2">
            <PenLine size={18} className="text-accent" />
            <h1 className="text-base font-semibold tracking-tight text-text-1">
              TypeyTypey
            </h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <ScreenplayEditor zoom={zoom} onZoomChange={setZoom} />
        </main>
      </div>
    </TooltipProvider>
  )
}
