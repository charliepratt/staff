import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { screenplayExtensions } from '../formats/screenplay/extensions'
import { useAutoSave } from '../storage/useAutoSave'
import { FormatToolbar } from './FormatToolbar'
import { SideToolbar } from './SideToolbar'
import { FormatContextMenu } from './FormatContextMenu'
import { ZoomControl } from './ZoomControl'
import { defaultFont, type ScreenplayFont } from '../formats/screenplay/fonts'
import '../formats/screenplay/screenplay.css'

const DOCUMENT_ID = 'draft-1'

const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'sceneHeading',
      content: [{ type: 'text', text: 'INT. COFFEE SHOP - DAY' }],
    },
    {
      type: 'action',
      content: [
        {
          type: 'text',
          text: 'A quiet coffee shop on a rainy afternoon. SARAH (30s, sharp eyes, ink-stained fingers) sits at a corner table, laptop open, staring at a blank screen.',
        },
      ],
    },
    {
      type: 'character',
      content: [{ type: 'text', text: 'Sarah' }],
    },
    {
      type: 'parenthetical',
      content: [{ type: 'text', text: '(to herself)' }],
    },
    {
      type: 'dialogue',
      content: [{ type: 'text', text: "Just write something. Anything." }],
    },
    {
      type: 'action',
      content: [
        {
          type: 'text',
          text: 'She types a few words, then deletes them. A BARISTA approaches with a fresh cup.',
        },
      ],
    },
    {
      type: 'character',
      content: [{ type: 'text', text: 'Barista' }],
    },
    {
      type: 'dialogue',
      content: [{ type: 'text', text: "Refill. On the house. You look like you need it." }],
    },
    {
      type: 'character',
      content: [{ type: 'text', text: 'Sarah' }],
    },
    {
      type: 'dialogue',
      content: [{ type: 'text', text: "That obvious, huh?" }],
    },
    {
      type: 'transition',
      content: [{ type: 'text', text: 'CUT TO:' }],
    },
    {
      type: 'sceneHeading',
      content: [{ type: 'text', text: "INT. SARAH'S APARTMENT - NIGHT" }],
    },
    {
      type: 'action',
      content: [
        {
          type: 'text',
          text: 'Sarah sits cross-legged on the floor, surrounded by crumpled paper. The laptop glows in the dark room. She takes a breath and begins to type — this time, she doesn\'t stop.',
        },
      ],
    },
  ],
}

export function ScreenplayEditor() {
  const { save, load } = useAutoSave(DOCUMENT_ID)
  const [initialContent, setInitialContent] = useState(defaultContent)
  const [loaded, setLoaded] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [zoom, setZoom] = useState(1.25)
  const [font, setFont] = useState<ScreenplayFont>(defaultFont)

  useEffect(() => {
    load().then((saved) => {
      if (saved) {
        setInitialContent(saved as typeof defaultContent)
      }
      setLoaded(true)
    })
  }, [load])

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // Disable nodes that conflict with our custom screenplay nodes
          heading: false,
          blockquote: false,
          codeBlock: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          horizontalRule: false,
        }),
        ...screenplayExtensions,
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: 'screenplay-preview outline-none',
        },
      },
      onUpdate: ({ editor: e }) => {
        setSaveStatus('saving')
        save(e.getJSON())
        // The save is debounced, so we show "saving" briefly
        setTimeout(() => setSaveStatus('saved'), 1200)
      },
    },
    [loaded],
  )

  if (!loaded || !editor) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-3">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-0 z-30 xl:relative">
        <FormatToolbar editor={editor} font={font} onFontChange={setFont} />
      </div>
      <SideToolbar editor={editor} />
      <div
        className="screenplay-canvas"
        style={{ '--screenplay-zoom': zoom, '--screenplay-font': font.family } as React.CSSProperties}
      >
        <div className="screenplay-page">
          <EditorContent editor={editor} />
        </div>
      </div>
      <FormatContextMenu editor={editor} />
      <div className="px-3 py-1.5 text-xs text-text-3 border-t border-border-1 bg-surface-2 flex items-center justify-between">
        <span className="font-medium">Screenplay</span>
        <ZoomControl zoom={zoom} onZoomChange={setZoom} />
        <span className="min-w-[4rem] text-right">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'idle' && ''}
        </span>
      </div>
    </div>
  )
}
