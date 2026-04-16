import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface PaginationOptions {
  pageHeight: number
  topMargin: number
  bottomMargin: number
  pageGap: number
  debounceMs: number
}

export const paginationPluginKey = new PluginKey('pagination')

export const Pagination = Extension.create<PaginationOptions>({
  name: 'pagination',

  addOptions() {
    return {
      pageHeight: 1056,
      topMargin: 96,
      bottomMargin: 96,
      pageGap: 32,
      debounceMs: 100,
    }
  },

  addProseMirrorPlugins() {
    const opts = this.options
    const pageContent = opts.pageHeight - opts.topMargin - opts.bottomMargin
    const spacerHeight = opts.bottomMargin + opts.pageGap + opts.topMargin

    return [
      new Plugin({
        key: paginationPluginKey,

        state: {
          init() {
            return { decorations: DecorationSet.empty, pageCount: 1 }
          },
          apply(tr, value, _oldState, newState) {
            const meta = tr.getMeta(paginationPluginKey) as
              | { decorations: DecorationSet; pageCount: number }
              | undefined
            if (meta) return meta
            if (tr.docChanged) {
              return {
                ...value,
                decorations: value.decorations.map(tr.mapping, newState.doc),
              }
            }
            return value
          },
        },

        props: {
          decorations(state) {
            const pluginState = paginationPluginKey.getState(state) as
              | { decorations: DecorationSet; pageCount: number }
              | undefined
            return pluginState?.decorations ?? DecorationSet.empty
          },
        },

        view(editorView) {
          let debounceTimer: ReturnType<typeof setTimeout> | undefined
          let rafId = 0
          let lastScrollHeight = 0

          function createSpacerWidget(): HTMLElement {
            // The spacer is a simple blank div that takes up space
            // in the document flow. No visual content — the dashed
            // line is rendered separately on .screenplay-page.
            const spacer = document.createElement('div')
            spacer.className = 'pagination-spacer'
            spacer.setAttribute('contenteditable', 'false')
            spacer.style.height = `${spacerHeight}px`
            spacer.style.userSelect = 'none'
            spacer.style.pointerEvents = 'none'
            return spacer
          }

          function renderBreakLines(pageContainer: HTMLElement) {
            // Remove old break lines
            pageContainer.querySelectorAll('.pagination-break-line').forEach((el) => el.remove())

            // After decorations are applied, measure where each spacer
            // actually rendered, then place a dashed line at its center
            requestAnimationFrame(() => {
              const spacers = editorView.dom.querySelectorAll('.pagination-spacer')
              const pageRect = pageContainer.getBoundingClientRect()
              const scale = pageRect.width / 816 // actual scale factor

              spacers.forEach((spacer, i) => {
                const spacerRect = spacer.getBoundingClientRect()
                // Center of spacer in page-local coords (unscaled)
                const centerY = (spacerRect.top + spacerRect.height / 2 - pageRect.top) / scale

                const line = document.createElement('div')
                line.className = 'pagination-break-line'
                line.style.position = 'absolute'
                line.style.top = `${centerY}px`
                line.style.left = '0'
                line.style.width = '816px'
                line.style.height = '0'

                const num = document.createElement('span')
                num.className = 'pagination-break-number'
                num.textContent = `${i + 2}`

                line.appendChild(num)
                pageContainer.appendChild(line)
              })
            })
          }

          function recalculate(pass = 1) {
            const dom = editorView.dom
            const children = Array.from(dom.children) as HTMLElement[]
            if (children.length === 0) return

            const blocks: HTMLElement[] = []
            for (const child of children) {
              if (!child.classList.contains('pagination-spacer')) {
                blocks.push(child)
              }
            }
            if (blocks.length === 0) return

            let spacersSoFar = 0
            let currentPageBottom = opts.topMargin + pageContent
            const breakPositions: { pos: number; pageNum: number }[] = []
            let pageNum = 1

            for (const block of blocks) {
              const blockTop = block.offsetTop
              const blockBottom = blockTop + block.offsetHeight
              const virtualBottom = blockBottom - spacersSoFar

              if (virtualBottom > currentPageBottom && blockTop - spacersSoFar > opts.topMargin) {
                try {
                  const pos = editorView.posAtDOM(block, 0)
                  if (pos > 0) {
                    pageNum++
                    breakPositions.push({ pos, pageNum })
                    spacersSoFar += spacerHeight
                    currentPageBottom += pageContent + spacerHeight
                  }
                } catch {
                  // posAtDOM can throw
                }
              }
            }

            const totalPages = breakPositions.length + 1

            const pageContainer = dom.closest('.screenplay-page') as HTMLElement | null
            if (pageContainer) {
              const totalHeight =
                totalPages * opts.pageHeight +
                breakPositions.length * opts.pageGap
              pageContainer.style.minHeight = `${totalHeight}px`
            }

            // Build widget decorations (spacers only — no visual content)
            const decorations = breakPositions.map(({ pos }) =>
              Decoration.widget(pos, () => createSpacerWidget(), {
                side: -1,
                key: `page-spacer-${pos}`,
              }),
            )

            const decorationSet = DecorationSet.create(
              editorView.state.doc,
              decorations,
            )

            const tr = editorView.state.tr.setMeta(paginationPluginKey, {
              decorations: decorationSet,
              pageCount: totalPages,
            })
            tr.setMeta('addToHistory', false)
            editorView.dispatch(tr)

            // Render the visual break lines on the page container
            if (pageContainer) {
              renderBreakLines(pageContainer)
            }

            // Stabilization pass
            if (pass < 2) {
              requestAnimationFrame(() => {
                const newHeight = dom.scrollHeight
                if (newHeight !== lastScrollHeight) {
                  lastScrollHeight = newHeight
                  recalculate(pass + 1)
                }
              })
            }

            lastScrollHeight = dom.scrollHeight
          }

          function scheduleRecalculate() {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
              cancelAnimationFrame(rafId)
              rafId = requestAnimationFrame(() => recalculate(1))
            }, opts.debounceMs)
          }

          const initTimer = setTimeout(() => {
            recalculate(1)
            document.fonts.ready.then(scheduleRecalculate)
          }, 150)

          window.addEventListener('resize', scheduleRecalculate)

          return {
            update(view, prevState) {
              if (view.state.doc !== prevState.doc) {
                scheduleRecalculate()
                return
              }
              const currentHeight = view.dom.scrollHeight
              if (currentHeight !== lastScrollHeight) {
                lastScrollHeight = currentHeight
                scheduleRecalculate()
              }
            },
            destroy() {
              clearTimeout(debounceTimer)
              clearTimeout(initTimer)
              cancelAnimationFrame(rafId)
              window.removeEventListener('resize', scheduleRecalculate)
            },
          }
        },
      }),
    ]
  },
})
