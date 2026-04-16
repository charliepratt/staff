import type { Editor } from '@tiptap/react'
import { screenplayElements, type ScreenplayElement } from '../formats/screenplay/extensions'
import type { ScreenplayFont } from '../formats/screenplay/fonts'
import { FontPicker } from './FontPicker'
import { Tooltip } from '../ui/Tooltip'

interface FormatToolbarProps {
  editor: Editor
  font: ScreenplayFont
  onFontChange: (font: ScreenplayFont) => void
}

export function FormatToolbar({ editor, font, onFontChange }: FormatToolbarProps) {
  const setElement = (type: ScreenplayElement) => {
    editor.chain().focus().setNode(type).run()
  }

  const activeElement = screenplayElements.find((el) => editor.isActive(el.type))

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border-1 bg-surface-2">
      <FontPicker selected={font} onSelect={onFontChange} />
      <div className="w-px h-5 bg-border-1 mx-1" />
      {screenplayElements.map((el) => (
        <Tooltip key={el.type} content={`${el.label} (\u2318${el.shortcut})`}>
          <button
            onClick={() => setElement(el.type)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeElement?.type === el.type
                ? 'bg-accent text-accent-text'
                : 'text-text-2 hover:bg-surface-3 hover:text-text-1'
            }`}
          >
            {el.label}
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
