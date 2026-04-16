import { useState, useEffect } from 'react'
import { Keyboard, X } from 'lucide-react'
import { Tooltip } from '../ui/Tooltip'

const MAC = navigator.platform.includes('Mac')
const MOD = MAC ? '\u2318' : 'Ctrl'
const SHIFT = MAC ? '\u21E7' : 'Shift'

interface ShortcutGroup {
  title: string
  shortcuts: { keys: string; description: string }[]
}

const groups: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: `${MOD}S`, description: 'Save' },
      { keys: `${MOD}Z`, description: 'Undo' },
      { keys: `${MOD} ${SHIFT} Z`, description: 'Redo' },
      { keys: `${MOD}\\`, description: 'Toggle scene navigator' },
    ],
  },
  {
    title: 'Element Formatting',
    shortcuts: [
      { keys: `${MOD}1`, description: 'Scene Heading' },
      { keys: `${MOD}2`, description: 'Action' },
      { keys: `${MOD}3`, description: 'Character' },
      { keys: `${MOD}4`, description: 'Dialogue' },
      { keys: `${MOD}5`, description: 'Parenthetical' },
      { keys: `${MOD}6`, description: 'Transition' },
      { keys: 'Tab', description: 'Cycle to next element type' },
      { keys: `${SHIFT} Tab`, description: 'Cycle to previous element type' },
    ],
  },
  {
    title: 'Smart Flow (Enter)',
    shortcuts: [
      { keys: 'Scene Heading \u2192 Enter', description: 'Action' },
      { keys: 'Character \u2192 Enter', description: 'Dialogue' },
      { keys: 'Dialogue \u2192 Enter', description: 'Character' },
      { keys: 'Parenthetical \u2192 Enter', description: 'Dialogue' },
      { keys: 'Transition \u2192 Enter', description: 'Scene Heading' },
      { keys: 'Empty line \u2192 Enter', description: 'Escape to Action' },
    ],
  },
  {
    title: 'Zoom',
    shortcuts: [
      { keys: `${MOD} ${SHIFT} =`, description: 'Zoom in' },
      { keys: `${MOD} ${SHIFT} -`, description: 'Zoom out' },
      { keys: `${MOD} ${SHIFT} 0`, description: 'Reset zoom to 125%' },
    ],
  },
  {
    title: 'Auto-Detection',
    shortcuts: [
      { keys: 'INT. / EXT.', description: 'Auto-converts to Scene Heading' },
      { keys: 'CUT TO:', description: 'Auto-converts to Transition' },
    ],
  },
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      // Mount first, then animate in after a tick so the browser
      // registers the initial off-screen state before transitioning
      const id = setTimeout(() => setVisible(true), 20)
      return () => clearTimeout(id)
    } else {
      setVisible(false)
    }
  }, [open])

  const handleClose = () => {
    setVisible(false)
    // Wait for animation to finish before unmounting
    setTimeout(() => setOpen(false), 250)
  }

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <>
      <Tooltip content="Keyboard shortcuts">
        <button
          onClick={() => setOpen(true)}
          aria-label="Keyboard shortcuts"
          className="p-1.5 rounded text-text-3 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
        >
          <Keyboard size={16} />
        </button>
      </Tooltip>

      {open && (
        <>
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-250 ease-out ${visible ? 'bg-black/10' : 'bg-black/0'}`}
            onClick={handleClose}
          />
          <div className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[360px] bg-surface-1 border-l border-border-1 shadow-xl flex flex-col transition-transform duration-250 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-1 shrink-0">
              <h2 className="text-base font-semibold text-text-1">Keyboard Shortcuts</h2>
              <button
                onClick={handleClose}
                aria-label="Close shortcuts"
                className="p-1.5 rounded text-text-3 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {groups.map((group, i) => (
                <div key={group.title} className={i > 0 ? 'mt-5 pt-5 border-t border-border-1' : ''}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-2 mb-3">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((s) => (
                      <div key={s.keys} className="flex items-center justify-between py-0.5">
                        <span className="text-sm text-text-1">{s.description}</span>
                        <kbd className="text-sm font-sans font-medium text-text-2 bg-surface-2 border border-border-1 rounded-md px-2.5 py-1 ml-4 whitespace-nowrap">
                          {s.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
