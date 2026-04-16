import { Node } from '@tiptap/core'

export const Character = Node.create({
  name: 'character',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="character"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'character', class: 'screenplay-character' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('character')) return false
        return editor.chain().splitBlock().setNode('dialogue').run()
      },
    }
  },
})
