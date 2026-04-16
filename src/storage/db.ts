import Dexie, { type EntityTable } from 'dexie'
import type { JSONContent } from '@tiptap/core'
import type { TitlePageData } from '../components/TitlePage'

export interface Document {
  id: string
  title: string
  format: string
  content: JSONContent
  titlePage?: TitlePageData
  updatedAt: number
  createdAt: number
}

const db = new Dexie('typeytypey') as Dexie & {
  documents: EntityTable<Document, 'id'>
}

db.version(1).stores({
  documents: 'id, title, format, updatedAt',
})

// v2 adds titlePage field (auto-migrated by Dexie — new optional field)
db.version(2).stores({
  documents: 'id, title, format, updatedAt',
})

export { db }
