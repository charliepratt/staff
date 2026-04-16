import { useState, useEffect, useCallback, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { PanelLeft, FileText } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'
import { sceneFlashKey } from '../editor/extensions/SceneFlash'
import type { TitlePageData } from './TitlePage'

interface Scene {
  text: string
  pos: number
  index: number
}

interface SceneNavigatorProps {
  editor: Editor
  titlePage: TitlePageData
  open: boolean
  onClose: () => void
}

const MIN_WIDTH = 180
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 224

function extractScenes(editor: Editor): Scene[] {
  const scenes: Scene[] = []
  let index = 0
  editor.state.doc.forEach((node, offset) => {
    if (node.type.name === 'sceneHeading') {
      index++
      scenes.push({
        text: node.textContent || 'Untitled Scene',
        pos: offset,
        index,
      })
    }
  })
  return scenes
}

export function SceneNavigator({ editor, titlePage, open, onClose }: SceneNavigatorProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const [activePos, setActivePos] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    setScenes(extractScenes(editor))
  }, [editor])

  useEffect(() => {
    refresh()
    editor.on('update', refresh)
    return () => { editor.off('update', refresh) }
  }, [editor, refresh])

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX
    const startWidth = width

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + (e.clientX - startX)))
      setWidth(newWidth)
    }

    const onMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [width])

  const jumpToScene = (pos: number) => {
    setActivePos(pos)
    editor.chain().focus().setTextSelection(pos + 1).run()

    editor.view.dispatch(
      editor.state.tr
        .setMeta(sceneFlashKey, pos)
        .setMeta('addToHistory', false)
    )

    requestAnimationFrame(() => {
      try {
        const resolved = editor.view.domAtPos(pos + 1)
        const el = resolved.node instanceof HTMLElement
          ? resolved.node
          : resolved.node.parentElement
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch {
        // ignore
      }
    })

    setMobileOpen(false)
  }

  const scrollToTop = () => {
    setActivePos(-1)
    const canvas = document.querySelector('.screenplay-canvas')
    canvas?.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-1">
        <span className="text-xs font-semibold text-text-2 uppercase tracking-wider">Scenes</span>
        <Tooltip content="Close panel">
          <button
            onClick={onClose}
            className="p-1 rounded text-text-3 hover:text-text-1 hover:bg-surface-3 cursor-pointer transition-colors"
          >
            <PanelLeft size={14} />
          </button>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {/* Title page — same visual treatment as scene entries */}
        <button
          onClick={scrollToTop}
          className={`w-full text-left px-3 py-2 flex items-start gap-2 text-xs transition-colors cursor-pointer group ${
            activePos === -1
              ? 'bg-border-1/50 border-l-2 border-accent'
              : 'hover:bg-surface-2 border-l-2 border-transparent'
          }`}
        >
          <FileText size={12} className={`shrink-0 mt-px ${activePos === -1 ? 'text-text-1' : 'text-text-3'}`} />
          <span className={`truncate leading-snug ${activePos === -1 ? 'text-text-1 font-medium' : 'text-text-2 group-hover:text-text-1'}`}>
            {titlePage.title || 'Title Page'}
          </span>
        </button>

        {scenes.length === 0 ? (
          <div className="px-3 py-4 text-[11px] text-text-3 text-center">
            No scenes yet. Add a scene heading to get started.
          </div>
        ) : (
          scenes.map((scene) => {
            const isActive = activePos === scene.pos
            return (
              <button
                key={scene.pos}
                onClick={() => jumpToScene(scene.pos)}
                className={`w-full text-left px-3 py-2 flex items-start gap-2 text-xs transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-border-1/50 border-l-2 border-accent'
                    : 'hover:bg-surface-2 border-l-2 border-transparent'
                }`}
              >
                <span className={`tabular-nums shrink-0 mt-px w-4 text-right ${isActive ? 'text-text-1' : 'text-text-3'}`}>
                  {scene.index}
                </span>
                <span className={`truncate leading-snug ${isActive ? 'text-text-1 font-medium' : 'text-text-2 group-hover:text-text-1'}`}>
                  {scene.text.toUpperCase()}
                </span>
              </button>
            )
          })
        )}
      </div>
      <div className="px-3 py-2 border-t border-border-1 text-xs text-text-3">
        {scenes.length} {scenes.length === 1 ? 'scene' : 'scenes'}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: in-flow panel with slide transition */}
      <div
        ref={panelRef}
        className="hidden md:flex bg-surface-1 border-r border-border-1 flex-col shrink-0 relative overflow-hidden transition-all duration-150 ease-out"
        style={{ width: open ? `${width}px` : '0px', borderRightWidth: open ? '1px' : '0px' }}
      >
        <div style={{ width: `${width}px`, minWidth: `${width}px` }} className="flex flex-col h-full">
          {navContent}
        </div>
        {open && (
          <div
            onMouseDown={startDrag}
            className={`absolute top-0 right-0 bottom-0 w-1 cursor-col-resize transition-colors hover:bg-accent/30 ${
              isDragging ? 'bg-accent/30' : ''
            }`}
          />
        )}
      </div>

      {/* Mobile: overlay drawer */}
      <div className="md:hidden">
        <Tooltip content="Scenes">
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-4 left-4 z-40 p-3 bg-surface-1 border border-border-1 rounded-full shadow-lg text-text-2 hover:text-text-1 cursor-pointer transition-colors"
          >
            <PanelLeft size={18} />
          </button>
        </Tooltip>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-72 bg-surface-1 border-r border-border-1 shadow-xl z-50">
              {navContent}
            </div>
          </>
        )}
      </div>

      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </>
  )
}
