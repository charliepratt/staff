import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/DropdownMenu'
import { screenplayFonts, type ScreenplayFont } from '../formats/screenplay/fonts'

interface FontPickerProps {
  selected: ScreenplayFont
  onSelect: (font: ScreenplayFont) => void
}

const categories = [
  { key: 'monospace', label: 'Monospace / Typewriter' },
  { key: 'sans-serif', label: 'Sans Serif' },
  { key: 'serif', label: 'Serif' },
] as const

export function FontPicker({ selected, onSelect }: FontPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-text-2 hover:bg-surface-2 hover:text-text-1">
          <span style={{ fontFamily: selected.family }} className="text-sm">
            Aa
          </span>
          <span>{selected.name}</span>
          <ChevronDown size={12} className="opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[280px] max-h-[420px] overflow-y-auto">
        {categories.map((cat, catIdx) => {
          const fonts = screenplayFonts.filter((f) => f.category === cat.key)
          if (fonts.length === 0) return null
          return (
            <div key={cat.key}>
              {catIdx > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{cat.label}</DropdownMenuLabel>
              {fonts.map((font) => (
                <DropdownMenuItem
                  key={font.id}
                  onSelect={() => onSelect(font)}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      style={{ fontFamily: font.family }}
                      className={`text-sm truncate ${
                        selected.id === font.id ? 'text-accent font-medium' : ''
                      }`}
                    >
                      {font.name}
                    </span>
                    <span className="text-[11px] text-text-3 leading-tight">
                      {font.description}
                    </span>
                  </div>
                  <span
                    style={{ fontFamily: font.family }}
                    className="text-[11px] text-text-3 whitespace-nowrap shrink-0"
                  >
                    INT. COFFEE SHOP
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
