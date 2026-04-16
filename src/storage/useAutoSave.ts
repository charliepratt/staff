import { useCallback, useRef } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { TitlePageData } from '../components/TitlePage'
import { db, type Document } from './db'

const SAVE_DEBOUNCE_MS = 1000

export interface SaveState {
  status: 'idle' | 'saving' | 'saved'
}

export function useAutoSave(documentId: string) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const saveCallbackRef = useRef<(() => void) | null>(null)

  const save = useCallback(
    (content: JSONContent, titlePage?: TitlePageData) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Notify saving started
      saveCallbackRef.current?.()

      timeoutRef.current = setTimeout(async () => {
        const now = Date.now()
        const existing = await db.documents.get(documentId)
        if (existing) {
          await db.documents.update(documentId, {
            content,
            titlePage,
            updatedAt: now,
          })
        } else {
          const doc: Document = {
            id: documentId,
            title: 'Untitled Screenplay',
            format: 'screenplay',
            content,
            titlePage,
            createdAt: now,
            updatedAt: now,
          }
          await db.documents.add(doc)
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [documentId],
  )

  const load = useCallback(async () => {
    const doc = await db.documents.get(documentId)
    return {
      content: doc?.content ?? null,
      titlePage: doc?.titlePage ?? null,
    }
  }, [documentId])

  return { save, load }
}
