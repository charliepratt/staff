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
        // Action → Action (single undo step)
        return editor.commands.command(({ tr, dispatch }) => {
          if (!dispatch) return true
          const { $from } = tr.selection
          tr.split($from.pos)
          const newPos = tr.mapping.map($from.pos)
          const $new = tr.doc.resolve(newPos)
          tr.setNodeMarkup($new.before($new.depth), editor.schema.nodes.action)
          return true
        })
      },
    }
  },
})
