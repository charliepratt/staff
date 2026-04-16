import type { Editor } from '@tiptap/react'
import {
  Clapperboard,
  MessageSquareText,
  User,
  AlignLeft,
  Parentheses,
  ArrowRightToLine,
} from 'lucide-react'
import { screenplayElements, type ScreenplayElement } from '../formats/screenplay/extensions'
import { Tooltip } from '../ui/Tooltip'
import type { LucideIcon } from 'lucide-react'

interface SideToolbarProps {
  editor: Editor
}

const elementIcons: Record<ScreenplayElement, LucideIcon> = {
  sceneHeading: Clapperboard,
  action: AlignLeft,
  character: User,
  dialogue: MessageSquareText,
  parenthetical: Parentheses,
  transition: ArrowRightToLine,
}

export function SideToolbar({ editor }: SideToolbarProps) {
  const activeElement = screenplayElements.find((el) => editor.isActive(el.type))

  return (
    <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 bg-surface-1 border border-border-1 rounded-xl shadow-lg p-1.5">
      {screenplayElements.map((el) => {
        const Icon = elementIcons[el.type]
        const isActive = activeElement?.type === el.type
        return (
          <Tooltip key={el.type} content={`${el.label} (\u2318${el.shortcut})`} side="right">
            <button
              onClick={() => editor.chain().focus().setNode(el.type).run()}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-accent text-accent-text'
                  : 'text-text-3 hover:bg-surface-2 hover:text-text-1'
              }`}
            >
              <Icon size={16} />
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
