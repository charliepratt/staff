import { useCallback, useRef } from 'react'
import type { JSONContent } from '@tiptap/core'
import { db, type Document } from './db'

const SAVE_DEBOUNCE_MS = 1000

export function useAutoSave(documentId: string) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const save = useCallback(
    (content: JSONContent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(async () => {
        const now = Date.now()
        const existing = await db.documents.get(documentId)
        if (existing) {
          await db.documents.update(documentId, { content, updatedAt: now })
        } else {
          const doc: Document = {
            id: documentId,
            title: 'Untitled Screenplay',
            format: 'screenplay',
            content,
            createdAt: now,
            updatedAt: now,
          }
          await db.documents.add(doc)
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [documentId],
  )

  const load = useCallback(async (): Promise<JSONContent | null> => {
    const doc = await db.documents.get(documentId)
    return doc?.content ?? null
  }, [documentId])

  return { save, load }
}
