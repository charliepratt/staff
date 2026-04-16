import { useRef, useEffect } from 'react'

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
  title: 'The Last Draft',
  author: 'Sarah Chen',
  contactName: 'Sarah Chen',
  contactEmail: 'sarah@example.com',
  contactPhone: '(310) 555-0142',
  draft: 'First Draft',
  date: 'April 2026',
}

interface TitlePageProps {
  data: TitlePageData
  onChange: (data: TitlePageData) => void
}

/**
 * Inline-editable title page. Click any text to edit it in place.
 * No form overlay — pure WYSIWYG.
 */
export function TitlePage({ data, onChange }: TitlePageProps) {
  const update = (field: keyof TitlePageData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="screenplay-title-page">
      <div className="title-block">
        <EditableField
          value={data.title}
          placeholder="Untitled Screenplay"
          onChange={(v) => update('title', v)}
          className="title-text"
        />
        <div className="byline">Written by</div>
        <EditableField
          value={data.author}
          placeholder="Your name"
          onChange={(v) => update('author', v)}
          className="author"
        />
      </div>

      <div className="contact-block">
        <EditableField
          value={data.contactName}
          placeholder="Contact name"
          onChange={(v) => update('contactName', v)}
        />
        <EditableField
          value={data.contactEmail}
          placeholder="email@example.com"
          onChange={(v) => update('contactEmail', v)}
        />
        <EditableField
          value={data.contactPhone}
          placeholder="(555) 555-5555"
          onChange={(v) => update('contactPhone', v)}
        />
      </div>

      <div className="draft-block">
        <EditableField
          value={data.draft}
          placeholder="Draft"
          onChange={(v) => update('draft', v)}
        />
        <EditableField
          value={data.date}
          placeholder="Date"
          onChange={(v) => update('date', v)}
        />
      </div>
    </div>
  )
}

/**
 * A single inline-editable text field. Renders as a contenteditable
 * span that looks like static text until you click/focus it.
 */
function EditableField({
  value,
  placeholder,
  onChange,
  className = '',
}: {
  value: string
  placeholder: string
  onChange: (v: string) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Sync external value changes into the DOM (only if different)
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  const handleBlur = () => {
    const text = ref.current?.textContent?.trim() ?? ''
    if (text !== value) {
      onChange(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      ref.current?.blur()
    }
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`title-page-editable ${className}`}
    >
      {value}
    </div>
  )
}

export { defaultTitlePage }
