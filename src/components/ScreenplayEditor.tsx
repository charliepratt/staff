import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState, useCallback, useRef } from 'react'
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
  navOpen: boolean
  onNavToggle: () => void
  onTitleChange: (title: string) => void
}

export function ScreenplayEditor({ zoom, onZoomChange, navOpen, onNavToggle, onTitleChange }: ScreenplayEditorProps) {
  const { save, saveNow, load } = useAutoSave(DOCUMENT_ID)
  const [initialContent, setInitialContent] = useState(defaultContent)
  const [loaded, setLoaded] = useState(false)
  const [font, setFont] = useState<ScreenplayFont>(defaultFont)
  const [titlePage, setTitlePage] = useState<TitlePageData>(defaultTitlePage)
  const [showSaveCheck, setShowSaveCheck] = useState(false)

  useEffect(() => {
    load().then((saved) => {
      if (saved.content) {
        setInitialContent(saved.content as typeof defaultContent)
      }
      if (saved.titlePage) {
        setTitlePage(saved.titlePage)
        onTitleChange(saved.titlePage.title)
      } else {
        onTitleChange(defaultTitlePage.title)
      }
      setLoaded(true)
    })
  }, [load, onTitleChange])

  const handleTitlePageChange = useCallback(
    (tp: TitlePageData) => {
      setTitlePage(tp)
      onTitleChange(tp.title)
      save(defaultContent, tp)
    },
    [save, onTitleChange],
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
        save(e.getJSON(), titlePage)
      },
    },
    [loaded],
  )

  const stats = useDocumentStats(editor)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollRestored, setScrollRestored] = useState(false)

  // Save cursor position on every selection change
  useEffect(() => {
    if (!editor) return

    const saveCursor = () => {
      const pos = editor.state.selection.from
      sessionStorage.setItem(`cursor-${DOCUMENT_ID}`, String(pos))
    }

    editor.on('selectionUpdate', saveCursor)
    editor.on('update', saveCursor)
    return () => {
      editor.off('selectionUpdate', saveCursor)
      editor.off('update', saveCursor)
    }
  }, [editor])

  // Restore cursor position after content + pagination loads
  const hasRestored = useRef(false)
  useEffect(() => {
    if (!editor || hasRestored.current) return

    const savedPos = sessionStorage.getItem(`cursor-${DOCUMENT_ID}`)
    if (!savedPos) {
      setScrollRestored(true)
      return
    }

    const pos = parseInt(savedPos, 10)

    const restore = () => {
      hasRestored.current = true
      try {
        const maxPos = editor.state.doc.content.size
        const safePos = Math.min(pos, maxPos)
        editor.chain().focus().setTextSelection(safePos).run()

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              const domPos = editor.view.domAtPos(safePos)
              const el = domPos.node instanceof HTMLElement
                ? domPos.node
                : domPos.node.parentElement
              if (el && scrollRef.current) {
                const elRect = el.getBoundingClientRect()
                const canvasRect = scrollRef.current.getBoundingClientRect()
                const scrollTarget = scrollRef.current.scrollTop + (elRect.top - canvasRect.top) - canvasRect.height / 3
                scrollRef.current.scrollTop = Math.max(0, scrollTarget)
              }
            } catch {
              // fallback
            }
            setScrollRestored(true)
          })
        })
      } catch {
        setScrollRestored(true)
      }
    }

    const timer = setTimeout(restore, 500)
    return () => clearTimeout(timer)
  }, [editor])

  // Cmd+S — immediate save with subtle checkmark
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        saveNow().then(() => {
          setShowSaveCheck(true)
          setTimeout(() => setShowSaveCheck(false), 1500)
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveNow])

  // beforeunload — force save on tab close
  useEffect(() => {
    function handleUnload() {
      saveNow()
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [saveNow])

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
          navOpen={navOpen}
          onNavToggle={onNavToggle}
        />
      </div>
      <div className="flex flex-1 min-h-0">
        <SceneNavigator
          editor={editor}
          titlePage={titlePage}
          open={navOpen}
          onClose={onNavToggle}
        />
        <FormatContextMenu editor={editor}>
          <div
            ref={scrollRef}
            className="screenplay-canvas"
            style={{
              '--screenplay-zoom': zoom,
              '--screenplay-font': font.family,
              opacity: scrollRestored ? 1 : 0,
            } as React.CSSProperties}
          >
            {/* Cmd+S save confirmation — bottom-right of canvas */}
            {showSaveCheck && (
              <div className="fixed bottom-6 right-10 z-40 save-check-fade flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border-1 rounded-full">
                <span className="text-xs text-text-2">Saved</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-success">
                  <path d="M2.5 6.5L5 9L9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
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
