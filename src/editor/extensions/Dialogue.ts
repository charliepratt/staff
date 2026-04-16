import { Node } from '@tiptap/core'

export const Dialogue = Node.create({
  name: 'dialogue',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="dialogue"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'dialogue', class: 'screenplay-dialogue' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('dialogue')) return false
        return editor.chain().splitBlock().setNode('action').run()
      },
    }
  },
})
