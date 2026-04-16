import { Node } from '@tiptap/core'

export const Action = Node.create({
  name: 'action',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="action"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'action', class: 'screenplay-action' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('action')) return false
        return editor.chain().splitBlock().setNode('action').run()
      },
    }
  },
})
