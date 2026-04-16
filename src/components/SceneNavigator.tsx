import { useState, useEffect, useCallback, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { PanelLeftClose, PanelLeftOpen, FileText, Clapperboard } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'
import type { TitlePageData } from './TitlePage'

interface Scene {
  text: string
  pos: number
  index: number
}

interface SceneNavigatorProps {
  editor: Editor
  titlePage: TitlePageData
  collapsed: boolean
  onToggle: () => void
}

const MIN_WIDTH = 180
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 224

function getEditorDom(editor: Editor): HTMLElement | null {
  try {
    return editor.view.dom as HTMLElement
  } catch {
    return null
  }
}

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

export function SceneNavigator({ editor, titlePage, collapsed, onToggle }: SceneNavigatorProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    setScenes(extractScenes(editor))
  }, [editor])

  useEffect(() => {
    refresh()
    editor.on('update', refresh)
    return () => { editor.off('update', refresh) }
  }, [editor, refresh])

  // Resize drag handling
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
    editor.chain().focus().setTextSelection(pos + 1).run()

    const dom = getEditorDom(editor)
    if (!dom) return
    requestAnimationFrame(() => {
      try {
        const resolved = editor.view.domAtPos(pos + 1)
        const el = resolved.node instanceof HTMLElement
          ? resolved.node
          : resolved.node.parentElement
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch {
        // ignore if position is invalid
      }
    })

    setMobileOpen(false)
  }

  const scrollToTop = () => {
    const canvas = document.querySelector('.screenplay-canvas')
    canvas?.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-1">
        <span className="text-xs font-semibold text-text-2 uppercase tracking-wider">Scenes</span>
        <Tooltip content="Collapse panel">
          <button
            onClick={() => { onToggle(); setMobileOpen(false) }}
            className="p-1 rounded text-text-3 hover:text-text-1 hover:bg-surface-3 cursor-pointer transition-colors"
          >
            <PanelLeftClose size={14} />
          </button>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        <button
          onClick={scrollToTop}
          className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs hover:bg-surface-2 transition-colors cursor-pointer group"
        >
          <FileText size={12} className="text-text-3 shrink-0" />
          <span className="text-text-2 group-hover:text-text-1 truncate font-medium">
            {titlePage.title || 'Title Page'}
          </span>
        </button>

        <div className="h-px bg-border-1 mx-3 my-1" />

        {scenes.length === 0 ? (
          <div className="px-3 py-4 text-[11px] text-text-3 text-center">
            No scenes yet. Add a scene heading to get started.
          </div>
        ) : (
          scenes.map((scene) => (
            <button
              key={scene.pos}
              onClick={() => jumpToScene(scene.pos)}
              className="w-full text-left px-3 py-2 flex items-start gap-2 text-xs hover:bg-surface-2 transition-colors cursor-pointer group"
            >
              <span className="text-text-3 tabular-nums shrink-0 mt-px w-4 text-right">
                {scene.index}
              </span>
              <span className="text-text-2 group-hover:text-text-1 truncate leading-snug">
                {scene.text}
              </span>
            </button>
          ))
        )}
      </div>
      <div className="px-3 py-2 border-t border-border-1 text-[11px] text-text-3">
        {scenes.length} {scenes.length === 1 ? 'scene' : 'scenes'}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: floating overlay panel — does NOT affect canvas centering */}
      {!collapsed && (
        <div
          ref={panelRef}
          className="hidden md:flex absolute top-0 left-0 bottom-0 z-20 bg-surface-1 border-r border-border-1 flex-col"
          style={{ width: `${width}px` }}
        >
          {navContent}
          {/* Resize handle */}
          <div
            onMouseDown={startDrag}
            className={`absolute top-0 right-0 bottom-0 w-1 cursor-col-resize transition-colors hover:bg-accent/30 ${
              isDragging ? 'bg-accent/30' : ''
            }`}
          />
        </div>
      )}

      {/* Collapsed state: thin strip with toggle */}
      {collapsed && (
        <div className="hidden md:flex absolute top-0 left-0 bottom-0 z-20 items-start pt-2.5 pl-1.5 pr-1 bg-surface-1 border-r border-border-1">
          <Tooltip content="Show scenes" side="right">
            <button
              onClick={onToggle}
              className="p-1.5 rounded text-text-3 hover:text-text-1 hover:bg-surface-3 cursor-pointer transition-colors"
            >
              <PanelLeftOpen size={14} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Mobile: overlay drawer */}
      <div className="md:hidden">
        <Tooltip content="Scenes">
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-4 left-4 z-40 p-3 bg-surface-1 border border-border-1 rounded-full shadow-lg text-text-2 hover:text-text-1 cursor-pointer transition-colors"
          >
            <Clapperboard size={18} />
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

      {/* Prevent text selection while dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </>
  )
}
