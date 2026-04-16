import { useState } from 'react'
import { Pencil } from 'lucide-react'

export interface TitlePageData {
  title: string
  author: string
  contactName: string
  contactEmail: string
  contactPhone: string
  draft: string
  date: string
}

const defaultTitlePage: TitlePageData = {
  title: 'Untitled Screenplay',
  author: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  draft: '',
  date: '',
}

interface TitlePageProps {
  data: TitlePageData
  onChange: (data: TitlePageData) => void
}

export function TitlePage({ data, onChange }: TitlePageProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <TitlePageEditor data={data} onChange={onChange} onDone={() => setEditing(false)} />
  }

  return (
    <div className="screenplay-title-page group">
      <button
        onClick={() => setEditing(true)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-surface-2 text-text-3 hover:text-text-1 hover:bg-surface-3 cursor-pointer z-10"
        title="Edit title page"
      >
        <Pencil size={14} />
      </button>

      <div className="title-block">
        <div className="title-text">{data.title || 'Untitled Screenplay'}</div>
        {data.author && (
          <>
            <div className="byline">Written by</div>
            <div className="author">{data.author}</div>
          </>
        )}
      </div>

      {(data.contactName || data.contactEmail || data.contactPhone) && (
        <div className="contact-block">
          {data.contactName && <div>{data.contactName}</div>}
          {data.contactEmail && <div>{data.contactEmail}</div>}
          {data.contactPhone && <div>{data.contactPhone}</div>}
        </div>
      )}

      {(data.draft || data.date) && (
        <div className="draft-block">
          {data.draft && <div>{data.draft}</div>}
          {data.date && <div>{data.date}</div>}
        </div>
      )}
    </div>
  )
}

function TitlePageEditor({
  data,
  onChange,
  onDone,
}: {
  data: TitlePageData
  onChange: (data: TitlePageData) => void
  onDone: () => void
}) {
  const [form, setForm] = useState(data)

  const update = (field: keyof TitlePageData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const save = () => {
    onChange(form)
    onDone()
  }

  return (
    <div className="screenplay-title-page" style={{ justifyContent: 'flex-start', paddingTop: '1.5in' }}>
      <div className="w-full max-w-[400px] mx-auto flex flex-col gap-4" style={{ fontFamily: 'var(--font-sans)' }}>
        <h2 className="text-sm font-semibold text-text-1 mb-1">Title Page</h2>

        <Field label="Title" value={form.title} onChange={(v) => update('title', v)} placeholder="Untitled Screenplay" />
        <Field label="Written by" value={form.author} onChange={(v) => update('author', v)} placeholder="Your name" />

        <div className="border-t border-border-1 pt-4 mt-2">
          <p className="text-[11px] text-text-3 mb-3">Contact info (bottom left)</p>
          <div className="flex flex-col gap-3">
            <Field label="Name" value={form.contactName} onChange={(v) => update('contactName', v)} placeholder="Name" />
            <Field label="Email" value={form.contactEmail} onChange={(v) => update('contactEmail', v)} placeholder="email@example.com" />
            <Field label="Phone" value={form.contactPhone} onChange={(v) => update('contactPhone', v)} placeholder="(555) 555-5555" />
          </div>
        </div>

        <div className="border-t border-border-1 pt-4 mt-2">
          <p className="text-[11px] text-text-3 mb-3">Draft info (bottom right)</p>
          <div className="flex flex-col gap-3">
            <Field label="Draft" value={form.draft} onChange={(v) => update('draft', v)} placeholder="First Draft" />
            <Field label="Date" value={form.date} onChange={(v) => update('date', v)} placeholder="April 2026" />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={save}
            className="px-4 py-2 text-sm font-medium bg-accent text-accent-text rounded-md hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={onDone}
            className="px-4 py-2 text-sm font-medium text-text-2 hover:text-text-1 rounded-md hover:bg-surface-3 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-text-3 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-border-1 rounded-md bg-surface-1 text-text-1 placeholder:text-text-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
      />
    </div>
  )
}

export { defaultTitlePage }
