import { Node } from '@tiptap/core'

export const Parenthetical = Node.create({
  name: 'parenthetical',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="parenthetical"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'parenthetical', class: 'screenplay-parenthetical' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('parenthetical')) return false
        return editor.chain().splitBlock().setNode('dialogue').run()
      },
    }
  },
})
