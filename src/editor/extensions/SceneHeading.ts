import { Node } from '@tiptap/core'

export const SceneHeading = Node.create({
  name: 'sceneHeading',
  group: 'block',
  content: 'text*',

  parseHTML() {
    return [{ tag: 'div[data-type="scene-heading"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'scene-heading', class: 'screenplay-scene-heading' }, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (!editor.isActive('sceneHeading')) return false
        // Scene Heading → Action (single undo step)
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
