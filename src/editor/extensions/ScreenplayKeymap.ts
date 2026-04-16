import { Extension } from '@tiptap/core'
import type { ScreenplayElement } from '../../formats/screenplay/extensions'

/**
 * Tab cycling order — matches industry convention (Final Draft, Fade In, Arc Studio):
 * Action → Character → Scene Heading → Transition → back to Action
 *
 * This is the order when pressing Tab on an empty or current-element line.
 * Shift+Tab goes in reverse.
 */
const TAB_CYCLE: ScreenplayElement[] = [
  'action',
  'character',
  'sceneHeading',
  'transition',
]

function getCurrentElement(editor: { isActive: (name: string) => boolean }): ScreenplayElement | null {
  const all: ScreenplayElement[] = ['sceneHeading', 'action', 'character', 'dialogue', 'parenthetical', 'transition']
  return all.find((el) => editor.isActive(el)) ?? null
}

function cycleElement(current: ScreenplayElement | null, reverse: boolean): ScreenplayElement {
  const idx = current ? TAB_CYCLE.indexOf(current) : -1
  if (idx === -1) {
    // Not in cycle (e.g. dialogue, parenthetical) — jump to action
    return 'action'
  }
  if (reverse) {
    return TAB_CYCLE[(idx - 1 + TAB_CYCLE.length) % TAB_CYCLE.length]!
  }
  return TAB_CYCLE[(idx + 1) % TAB_CYCLE.length]!
}

/**
 * Smart auto-detection patterns:
 * - Lines starting with INT. / EXT. / I/E. → Scene Heading
 * - Lines ending with TO: → Transition (e.g. CUT TO:, DISSOLVE TO:)
 */
const SCENE_HEADING_PATTERN = /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s*/i
const TRANSITION_PATTERN = /\bTO:$/i

export const ScreenplayKeymap = Extension.create({
  name: 'screenplayKeymap',

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const current = getCurrentElement(editor)
        const next = cycleElement(current, false)
        return editor.chain().focus().setNode(next).run()
      },

      'Shift-Tab': ({ editor }) => {
        const current = getCurrentElement(editor)
        const next = cycleElement(current, true)
        return editor.chain().focus().setNode(next).run()
      },

      // Cmd+1..6 direct element switching
      'Mod-1': ({ editor }) => editor.chain().focus().setNode('sceneHeading').run(),
      'Mod-2': ({ editor }) => editor.chain().focus().setNode('action').run(),
      'Mod-3': ({ editor }) => editor.chain().focus().setNode('character').run(),
      'Mod-4': ({ editor }) => editor.chain().focus().setNode('dialogue').run(),
      'Mod-5': ({ editor }) => editor.chain().focus().setNode('parenthetical').run(),
      'Mod-6': ({ editor }) => editor.chain().focus().setNode('transition').run(),
    }
  },

  // Watch for text input and auto-detect element types
  onTransaction({ editor, transaction }) {
    if (!transaction.docChanged) return

    const { $from } = editor.state.selection
    const node = $from.parent
    const text = node.textContent

    // Only auto-detect when in Action (the default element) to avoid
    // overriding intentional formatting
    if (node.type.name !== 'action') return

    if (SCENE_HEADING_PATTERN.test(text)) {
      // Defer to avoid conflicting with the current transaction
      requestAnimationFrame(() => {
        editor.chain().setNode('sceneHeading').run()
      })
    } else if (TRANSITION_PATTERN.test(text)) {
      requestAnimationFrame(() => {
        editor.chain().setNode('transition').run()
      })
    }
  },
})
