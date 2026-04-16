import { useState, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/react'

export interface DocumentStats {
  wordCount: number
  pageCount: number
  runtime: string
}

/**
 * Counts all words in the document (total, including scene headings,
 * character names, etc. — this matches Final Draft's behavior).
 *
 * Page count is derived from content height vs. page content area (864px).
 * Runtime estimate: 1 page ≈ 1 minute (industry standard).
 */

function countWords(editor: Editor): number {
  const text = editor.state.doc.textContent
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

function getPageCount(editor: Editor): number {
  try {
    const dom = editor.view.dom as HTMLElement
    const contentHeight = dom.scrollHeight
    // Page content area: 1056px total - 96px top margin - 96px bottom margin = 864px
    const pageContentHeight = 864
    return Math.max(1, Math.ceil(contentHeight / pageContentHeight))
  } catch {
    return 1
  }
}

function formatRuntime(pages: number): string {
  const minutes = pages
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
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

    // Initial calculation after mount
    const timer = setTimeout(recalculate, 150)

    editor.on('update', recalculate)
    window.addEventListener('resize', recalculate)

    return () => {
      clearTimeout(timer)
      editor.off('update', recalculate)
      window.removeEventListener('resize', recalculate)
    }
  }, [editor, recalculate])

  return stats
}
