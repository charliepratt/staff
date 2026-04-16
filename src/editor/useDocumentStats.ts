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
    return pluginState?.pageCount ?? 1
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

    const timer = setTimeout(recalculate, 200)

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
