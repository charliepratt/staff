import { useState, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { paginationPluginKey } from './extensions/Pagination'

export interface DocumentStats {
  wordCount: number
  pageCount: number
  runtime: string
}

function countWords(editor: Editor): number {
  const text = editor.state.doc.textContent
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

function getPageCount(editor: Editor): number {
  try {
    const pluginState = paginationPluginKey.getState(editor.state) as
      | { pageCount: number }
      | undefined
    if (pluginState && pluginState.pageCount > 0) {
      return pluginState.pageCount
    }
    // Fallback: estimate from editor content height
    const dom = editor.view.dom as HTMLElement
    const contentHeight = dom.scrollHeight - 192 // subtract top+bottom padding
    return Math.max(1, Math.ceil(contentHeight / 864))
  } catch {
    return 1
  }
}

function formatRuntime(pages: number): string {
  if (pages <= 1) return '1 min'
  if (pages < 60) return `${pages} min`
  const hrs = Math.floor(pages / 60)
  const mins = pages % 60
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

export function useDocumentStats(editor: Editor | null): DocumentStats {
  const [stats, setStats] = useState<DocumentStats>({
    wordCount: 0,
    pageCount: 1,
    runtime: '1 min',
  })

  const recalculate = useCallback(() => {
    if (!editor) return

    const wordCount = countWords(editor)
    const pageCount = getPageCount(editor)
    const runtime = formatRuntime(pageCount)

    setStats({ wordCount, pageCount, runtime })
  }, [editor])

  useEffect(() => {
    if (!editor) return

    // Delay initial calculation to let pagination settle
    const timer = setTimeout(recalculate, 500)

    editor.on('update', recalculate)
    editor.on('transaction', recalculate)

    return () => {
      clearTimeout(timer)
      editor.off('update', recalculate)
      editor.off('transaction', recalculate)
    }
  }, [editor, recalculate])

  return stats
}
