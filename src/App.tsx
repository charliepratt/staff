import { useState, useEffect, useCallback } from 'react'
import { TooltipProvider } from './ui/Tooltip'
import { ScreenplayEditor } from './components/ScreenplayEditor'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { SaveIndicator } from './components/SaveIndicator'
import { PenLine } from 'lucide-react'

const ZOOM_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
const DEFAULT_ZOOM = 1.25

export default function App() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [navOpen, setNavOpen] = useState(true)

  const toggleNav = useCallback(() => {
    setNavOpen((v) => !v)
  }, [])

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z)
      return next ?? z
    })
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < z)
      return prev ?? z
    })
  }, [])

  const zoomReset = useCallback(() => {
    setZoom(DEFAULT_ZOOM)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+\ — toggle scene navigator
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        toggleNav()
        return
      }

      // Cmd+Shift+Plus/Minus/0 — zoom
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return

      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        zoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        zoomOut()
      } else if (e.key === '0' || e.key === ')') {
        e.preventDefault()
        zoomReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomIn, zoomOut, zoomReset, toggleNav])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full bg-surface-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border-1 bg-surface-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <PenLine size={18} className="text-accent" />
              <h1 className="text-base font-semibold tracking-tight text-text-1">
                TypeyTypey
              </h1>
            </div>
            <SaveIndicator status={saveStatus} />
          </div>
          <KeyboardShortcuts />
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <ScreenplayEditor
            zoom={zoom}
            onZoomChange={setZoom}
            onSaveStatusChange={setSaveStatus}
            navOpen={navOpen}
            onNavToggle={toggleNav}
          />
        </main>
      </div>
    </TooltipProvider>
  )
}
