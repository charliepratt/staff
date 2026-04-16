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
        return editor.chain().splitBlock().setNode('action').run()
      },
    }
  },
})
