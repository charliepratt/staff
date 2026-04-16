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
        const { $from } = editor.state.selection
        const isEmpty = $from.parent.textContent.length === 0
        if (isEmpty) {
          return editor.chain().setNode('action').run()
        }
        // Character → Dialogue (single undo step)
        return editor.commands.command(({ tr, dispatch }) => {
          if (!dispatch) return true
          const { $from } = tr.selection
          tr.split($from.pos)
          const newPos = tr.mapping.map($from.pos)
          const $new = tr.doc.resolve(newPos)
          tr.setNodeMarkup($new.before($new.depth), editor.schema.nodes.dialogue)
          return true
        })
      },
    }
  },
})
