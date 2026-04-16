import { Node } from '@tiptap/core'

export const Transition = Node.create({
  name: 'transition',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="transition"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'transition', class: 'screenplay-transition' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('transition')) return false
        return editor.chain().splitBlock().setNode('sceneHeading').run()
      },
    }
  },
})
