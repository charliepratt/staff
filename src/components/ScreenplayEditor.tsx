import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState, useCallback } from 'react'
import { screenplayExtensions } from '../formats/screenplay/extensions'
import { useAutoSave } from '../storage/useAutoSave'
import { useDocumentStats } from '../editor/useDocumentStats'
import { FormatToolbar } from './FormatToolbar'
import { SceneNavigator } from './SceneNavigator'
import { FormatContextMenu } from './FormatContextMenu'
import { TitlePage, defaultTitlePage, type TitlePageData } from './TitlePage'
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

interface ScreenplayEditorProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  onSaveStatusChange: (status: 'idle' | 'saving' | 'saved') => void
}

export function ScreenplayEditor({ zoom, onZoomChange, onSaveStatusChange }: ScreenplayEditorProps) {
  const { save, load } = useAutoSave(DOCUMENT_ID)
  const [initialContent, setInitialContent] = useState(defaultContent)
  const [loaded, setLoaded] = useState(false)
  const [font, setFont] = useState<ScreenplayFont>(defaultFont)
  const [titlePage, setTitlePage] = useState<TitlePageData>(defaultTitlePage)
  const [navCollapsed, setNavCollapsed] = useState(false)

  useEffect(() => {
    load().then((saved) => {
      if (saved.content) {
        setInitialContent(saved.content as typeof defaultContent)
      }
      if (saved.titlePage) {
        setTitlePage(saved.titlePage)
      }
      setLoaded(true)
    })
  }, [load])

  const triggerSave = useCallback(
    (content: typeof defaultContent, tp: TitlePageData) => {
      onSaveStatusChange('saving')
      save(content, tp)
      setTimeout(() => onSaveStatusChange('saved'), 1200)
      setTimeout(() => onSaveStatusChange('idle'), 3200)
    },
    [save, onSaveStatusChange],
  )

  const handleTitlePageChange = useCallback(
    (tp: TitlePageData) => {
      setTitlePage(tp)
      // Save with current editor content + new title page
      triggerSave(initialContent, tp)
    },
    [triggerSave, initialContent],
  )

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
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
        const content = e.getJSON()
        triggerSave(content as typeof defaultContent, titlePage)
      },
    },
    [loaded],
  )

  const stats = useDocumentStats(editor)

  if (!loaded || !editor) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-3">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="sticky top-0 z-30">
        <FormatToolbar
          editor={editor}
          font={font}
          onFontChange={setFont}
          zoom={zoom}
          onZoomChange={onZoomChange}
          wordCount={stats.wordCount}
          pageCount={stats.pageCount}
          runtime={stats.runtime}
        />
      </div>
      <div className="flex flex-1 min-h-0">
        <SceneNavigator
          editor={editor}
          titlePage={titlePage}
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed(!navCollapsed)}
        />
        <FormatContextMenu editor={editor}>
          <div
            className="screenplay-canvas"
            style={{ '--screenplay-zoom': zoom, '--screenplay-font': font.family } as React.CSSProperties}
          >
            <TitlePage data={titlePage} onChange={handleTitlePageChange} />
            <div className="screenplay-page">
              <EditorContent editor={editor} />
            </div>
          </div>
        </FormatContextMenu>
      </div>
    </div>
  )
}
