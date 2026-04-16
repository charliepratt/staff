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

          function createBreakWidget(pageNumber: number): HTMLElement {
            const spacer = document.createElement('div')
            spacer.className = 'pagination-break'
            spacer.setAttribute('contenteditable', 'false')
            spacer.style.height = `${spacerHeight}px`

            const line = document.createElement('div')
            line.className = 'pagination-break-line'

            const num = document.createElement('span')
            num.className = 'pagination-break-number'
            num.textContent = `${pageNumber}`
            line.appendChild(num)

            spacer.appendChild(line)
            return spacer
          }

          function recalculate(pass = 1) {
            const dom = editorView.dom
            const children = Array.from(dom.children) as HTMLElement[]
            if (children.length === 0) return

            // Walk block nodes using offsetTop for position (local coords,
            // immune to zoom transform). Track cumulative content per page.
            let contentOnPage = 0
            const breakPositions: { pos: number; pageNum: number }[] = []
            let pageNum = 1

            for (const child of children) {
              if (child.classList.contains('pagination-break')) continue

              // Use offsetTop relative to editor to get true position
              // offsetHeight gives the element's own height in local coords
              const h = child.offsetHeight

              if (contentOnPage + h > pageContent && contentOnPage > 0) {
                try {
                  const pos = editorView.posAtDOM(child, 0)
                  if (pos > 0) {
                    pageNum++
                    breakPositions.push({ pos, pageNum })
                  }
                } catch {
                  // posAtDOM can throw if node isn't in doc
                }
                contentOnPage = h
              } else {
                contentOnPage += h
              }
            }

            const totalPages = breakPositions.length + 1

            // Update page container height to show full pages
            const pageContainer = dom.closest('.screenplay-page') as HTMLElement | null
            if (pageContainer) {
              const totalHeight =
                totalPages * opts.pageHeight +
                breakPositions.length * opts.pageGap
              pageContainer.style.minHeight = `${totalHeight}px`
            }

            // Build decorations
            const decorations = breakPositions.map(({ pos, pageNum: pn }) =>
              Decoration.widget(pos, () => createBreakWidget(pn), {
                side: -1,
                key: `page-break-${pn}`,
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

            // Stabilization: after applying decorations, check if a second
            // pass produces the same result. Cap at 2 passes.
            if (pass < 2) {
              requestAnimationFrame(() => {
                const newScrollHeight = dom.scrollHeight
                if (newScrollHeight !== lastScrollHeight) {
                  lastScrollHeight = newScrollHeight
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
              // Recalculate on doc change
              if (view.state.doc !== prevState.doc) {
                scheduleRecalculate()
                return
              }
              // Also recalculate if scrollHeight changed (font switch, etc.)
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
