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

const paginationPluginKey = new PluginKey('pagination')

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
            return DecorationSet.empty
          },
          apply(tr, decorations) {
            const meta = tr.getMeta(paginationPluginKey) as DecorationSet | undefined
            if (meta) return meta
            if (tr.docChanged) return decorations.map(tr.mapping, tr.doc)
            return decorations
          },
        },

        props: {
          decorations(state) {
            return paginationPluginKey.getState(state) as DecorationSet
          },
        },

        view(editorView) {
          let debounceTimer: ReturnType<typeof setTimeout> | undefined
          let rafId = 0

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

          function recalculate() {
            const dom = editorView.dom
            const children = Array.from(dom.children) as HTMLElement[]
            if (children.length === 0) return

            // Walk block nodes, measure heights (skip our spacer widgets),
            // find where page breaks need to go
            let contentOnPage = 0
            const breakPositions: { pos: number; pageNum: number }[] = []
            let pageNum = 1

            for (const child of children) {
              if (child.classList.contains('pagination-break')) continue

              const h = child.offsetHeight

              if (contentOnPage + h > pageContent && contentOnPage > 0) {
                // This block overflows the page — break before it
                try {
                  const pos = editorView.posAtDOM(child, 0)
                  if (pos > 0) {
                    pageNum++
                    breakPositions.push({ pos, pageNum })
                  }
                } catch {
                  // posAtDOM can throw if the node isn't in the doc
                }
                contentOnPage = h
              } else {
                contentOnPage += h
              }
            }

            // Update page container height to always show full pages
            const totalPages = breakPositions.length + 1
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

            const tr = editorView.state.tr.setMeta(paginationPluginKey, decorationSet)
            tr.setMeta('addToHistory', false)
            tr.setMeta('pagination-update', true)
            editorView.dispatch(tr)
          }

          function scheduleRecalculate() {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
              cancelAnimationFrame(rafId)
              rafId = requestAnimationFrame(recalculate)
            }, opts.debounceMs)
          }

          const initTimer = setTimeout(() => {
            recalculate()
            document.fonts.ready.then(scheduleRecalculate)
          }, 150)

          window.addEventListener('resize', scheduleRecalculate)

          return {
            update(view, prevState) {
              if (view.state.doc !== prevState.doc) {
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
