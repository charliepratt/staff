import { useCallback, useRef } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { TitlePageData } from '../components/TitlePage'
import { db, type Document } from './db'

const SAVE_DEBOUNCE_MS = 1000

async function writeToDB(documentId: string, content: JSONContent, titlePage?: TitlePageData) {
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
}

export function useAutoSave(documentId: string) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lastContentRef = useRef<JSONContent | null>(null)
  const lastTitlePageRef = useRef<TitlePageData | undefined>(undefined)

  const save = useCallback(
    (content: JSONContent, titlePage?: TitlePageData) => {
      lastContentRef.current = content
      lastTitlePageRef.current = titlePage

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        writeToDB(documentId, content, titlePage)
      }, SAVE_DEBOUNCE_MS)
    },
    [documentId],
  )

  // Immediate save — bypasses debounce. Used for Cmd+S and beforeunload.
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (lastContentRef.current) {
      await writeToDB(documentId, lastContentRef.current, lastTitlePageRef.current)
    }
  }, [documentId])

  const load = useCallback(async () => {
    const doc = await db.documents.get(documentId)
    return {
      content: doc?.content ?? null,
      titlePage: doc?.titlePage ?? null,
    }
  }, [documentId])

  return { save, saveNow, load }
}
