import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/**
 * SceneFlash — ProseMirror node decoration that adds a CSS animation
 * class to a scene heading when jumping to it from the navigator.
 *
 * Usage from React:
 *   editor.view.dispatch(
 *     editor.state.tr.setMeta(sceneFlashKey, pos)
 *   )
 *
 * This is reliable because ProseMirror manages the decoration — no
 * coordinate math, no overlay divs, no zoom complications.
 */
export const sceneFlashKey = new PluginKey('sceneFlash')

export const SceneFlash = Extension.create({
  name: 'sceneFlash',

  addProseMirrorPlugins() {
    let clearTimer: ReturnType<typeof setTimeout> | undefined

    return [
      new Plugin({
        key: sceneFlashKey,

        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, decorations, _oldState, newState) {
            const flashPos = tr.getMeta(sceneFlashKey) as number | 'clear' | undefined

            if (flashPos === 'clear') {
              return DecorationSet.empty
            }

            if (typeof flashPos === 'number') {
              // Resolve the position and find the node
              try {
                const resolved = newState.doc.resolve(flashPos)
                const node = resolved.nodeAfter
                if (node && node.type.name === 'sceneHeading') {
                  const from = flashPos
                  const to = from + node.nodeSize
                  return DecorationSet.create(newState.doc, [
                    Decoration.node(from, to, { class: 'scene-flash' }),
                  ])
                }
              } catch {
                // Position invalid, return empty
              }
              return DecorationSet.empty
            }

            // Map existing decorations through document changes
            if (tr.docChanged) {
              return decorations.map(tr.mapping, tr.doc)
            }
            return decorations
          },
        },

        props: {
          decorations(state) {
            return sceneFlashKey.getState(state) as DecorationSet
          },
        },

        view() {
          return {
            update(view) {
              const decos = sceneFlashKey.getState(view.state) as DecorationSet
              if (decos && decos !== DecorationSet.empty) {
                clearTimeout(clearTimer)
                clearTimer = setTimeout(() => {
                  const tr = view.state.tr
                    .setMeta(sceneFlashKey, 'clear')
                    .setMeta('addToHistory', false)
                  view.dispatch(tr)
                }, 2500)
              }
            },
            destroy() {
              clearTimeout(clearTimer)
            },
          }
        },
      }),
    ]
  },
})
