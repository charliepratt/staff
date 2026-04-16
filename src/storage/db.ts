import Dexie, { type EntityTable } from 'dexie'
import type { JSONContent } from '@tiptap/core'

export interface Document {
  id: string
  title: string
  format: string
  content: JSONContent
  updatedAt: number
  createdAt: number
}

const db = new Dexie('typeytypey') as Dexie & {
  documents: EntityTable<Document, 'id'>
}

db.version(1).stores({
  documents: 'id, title, format, updatedAt',
})

export { db }
