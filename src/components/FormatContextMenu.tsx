import { useRef, type ReactNode } from 'react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import type { Editor } from '@tiptap/react'
import { screenplayElements, type ScreenplayElement } from '../formats/screenplay/extensions'

interface FormatContextMenuProps {
  editor: Editor
  children: ReactNode
}

export function FormatContextMenu({ editor, children }: FormatContextMenuProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  const setElement = (type: ScreenplayElement) => {
    editor.chain().focus().setNode(type).run()
  }

  const activeElement = screenplayElements.find((el) => editor.isActive(el.type))

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div ref={triggerRef} className="contents">
          {children}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="z-50 bg-surface-1 border border-border-1 rounded-lg shadow-lg py-1 min-w-[180px]">
          <ContextMenu.Label className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-3">
            Format as...
          </ContextMenu.Label>
          {screenplayElements.map((el) => (
            <ContextMenu.Item
              key={el.type}
              onSelect={() => setElement(el.type)}
              className={`px-3 py-1.5 text-sm flex items-center justify-between outline-none cursor-pointer transition-colors data-[highlighted]:bg-surface-2 ${
                activeElement?.type === el.type ? 'text-accent font-medium' : 'text-text-1'
              }`}
            >
              <span>{el.label}</span>
              <span className="text-[11px] text-text-3 ml-4">{'\u2318'}{el.shortcut}</span>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
