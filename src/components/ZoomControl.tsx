import { Minus, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Tooltip } from '../ui/Tooltip'

interface ZoomControlProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

const ZOOM_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
const MIN_ZOOM = ZOOM_STEPS[0]!
const MAX_ZOOM = ZOOM_STEPS[ZOOM_STEPS.length - 1]!

export function ZoomControl({ zoom, onZoomChange }: ZoomControlProps) {
  const zoomIn = () => {
    const next = ZOOM_STEPS.find((s) => s > zoom)
    if (next) onZoomChange(next)
  }

  const zoomOut = () => {
    const prev = [...ZOOM_STEPS].reverse().find((s) => s < zoom)
    if (prev) onZoomChange(prev)
  }

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content="Zoom out">
        <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
          <Minus size={14} />
        </Button>
      </Tooltip>
      <Tooltip content="Reset zoom">
        <button
          onClick={() => onZoomChange(1.25)}
          className="text-xs text-text-3 hover:text-text-1 tabular-nums cursor-pointer min-w-[3.5ch] text-center font-medium transition-colors"
        >
          {Math.round(zoom * 100)}%
        </button>
      </Tooltip>
      <Tooltip content="Zoom in">
        <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
          <Plus size={14} />
        </Button>
      </Tooltip>
    </div>
  )
}
