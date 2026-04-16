import { useEffect, useRef, useState, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { screenplayElements, type ScreenplayElement } from '../formats/screenplay/extensions'

interface FormatContextMenuProps {
  editor: Editor
}

interface MenuPosition {
  x: number
  y: number
}

export function FormatContextMenu({ editor }: FormatContextMenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      const editorEl = editor.view.dom
      if (!editorEl.contains(e.target as Node)) return

      e.preventDefault()
      setPosition({ x: e.clientX, y: e.clientY })
    },
    [editor],
  )

  const handleClose = useCallback(() => {
    setPosition(null)
  }, [])

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClose)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleClose()
    })

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClose)
    }
  }, [handleContextMenu, handleClose])

  useEffect(() => {
    if (!position || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const adjustedX = Math.min(position.x, window.innerWidth - rect.width - 8)
    const adjustedY = Math.min(position.y, window.innerHeight - rect.height - 8)
    if (adjustedX !== position.x || adjustedY !== position.y) {
      setPosition({ x: adjustedX, y: adjustedY })
    }
  }, [position])

  const setElement = (type: ScreenplayElement) => {
    editor.chain().focus().setNode(type).run()
    handleClose()
  }

  if (!position) return null

  const activeElement = screenplayElements.find((el) => editor.isActive(el.type))

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-surface-1 border border-border-1 rounded-lg shadow-lg py-1 min-w-[180px]"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-3">
        Format as...
      </div>
      {screenplayElements.map((el) => (
        <button
          key={el.type}
          onClick={() => setElement(el.type)}
          className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-surface-2 transition-colors cursor-pointer ${
            activeElement?.type === el.type ? 'text-accent font-medium' : 'text-text-1'
          }`}
        >
          <span>{el.label}</span>
          <span className="text-[11px] text-text-3 ml-4">{'\u2318'}{el.shortcut}</span>
        </button>
      ))}
    </div>
  )
}
