import type { Editor } from '@tiptap/react'
import {
  Clapperboard,
  AlignLeft,
  User,
  MessageSquareText,
  Parentheses,
  ArrowRightToLine,
  PanelLeft,
  Undo2,
  Redo2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { screenplayElements, type ScreenplayElement } from '../formats/screenplay/extensions'
import type { ScreenplayFont } from '../formats/screenplay/fonts'
import { FontPicker } from './FontPicker'
import { ZoomControl } from './ZoomControl'
import { Tooltip } from '../ui/Tooltip'

const elementIcons: Record<ScreenplayElement, LucideIcon> = {
  sceneHeading: Clapperboard,
  action: AlignLeft,
  character: User,
  dialogue: MessageSquareText,
  parenthetical: Parentheses,
  transition: ArrowRightToLine,
}

interface FormatToolbarProps {
  editor: Editor
  font: ScreenplayFont
  onFontChange: (font: ScreenplayFont) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  wordCount: number
  pageCount: number
  runtime: string
  navOpen: boolean
  onNavToggle: () => void
}

export function FormatToolbar({ editor, font, onFontChange, zoom, onZoomChange, wordCount, pageCount, runtime, navOpen, onNavToggle }: FormatToolbarProps) {
  const setElement = (type: ScreenplayElement) => {
    editor.chain().focus().setNode(type).run()
  }

  const activeElement = screenplayElements.find((el) => editor.isActive(el.type))

  return (
    <div className="flex items-center px-3 py-1.5 border-b border-border-1 bg-surface-2">
      {/* Scene navigator toggle */}
      <Tooltip content={`Scenes (\u2318\\)`}>
        <button
          onClick={onNavToggle}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            navOpen
              ? 'bg-border-1 text-text-1'
              : 'text-text-2 hover:bg-surface-3 hover:text-text-1'
          }`}
        >
          <PanelLeft size={16} />
        </button>
      </Tooltip>
      <div className="w-px h-6 bg-border-1 mx-2" />
      {/* Undo / Redo */}
      <Tooltip content="Undo (\u2318Z)">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-md transition-colors cursor-pointer text-text-2 hover:bg-surface-3 hover:text-text-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 size={15} />
        </button>
      </Tooltip>
      <Tooltip content="Redo (\u2318\u21E7Z)">
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-md transition-colors cursor-pointer text-text-2 hover:bg-surface-3 hover:text-text-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Redo2 size={15} />
        </button>
      </Tooltip>
      <div className="w-px h-6 bg-border-1 mx-2" />
      <FontPicker selected={font} onSelect={onFontChange} />
      <div className="w-px h-6 bg-border-1 mx-2" />
      <div className="flex items-center gap-0.5">
        {screenplayElements.map((el) => {
          const Icon = elementIcons[el.type]
          const isActive = activeElement?.type === el.type
          return (
            <Tooltip key={el.type} content={`${el.label} (\u2318${el.shortcut})`}>
              <button
                onClick={() => setElement(el.type)}
                className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-border-1 text-text-1'
                    : 'text-text-2 hover:bg-surface-3 hover:text-text-1'
                }`}
              >
                <Icon size={14} />
                <span className="hidden lg:inline">{el.label}</span>
              </button>
            </Tooltip>
          )
        })}
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Tooltip content={`${wordCount.toLocaleString()} words \u00b7 ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}>
          <span className="text-xs text-text-2 tabular-nums cursor-default hidden sm:inline">
            {wordCount.toLocaleString()} words &middot; ~{runtime}
          </span>
        </Tooltip>
        <div className="w-px h-5 bg-border-1" />
        <ZoomControl zoom={zoom} onZoomChange={onZoomChange} />
      </div>
    </div>
  )
}
