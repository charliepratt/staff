import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/DropdownMenu'
import { screenplayFonts, type ScreenplayFont } from '../formats/screenplay/fonts'

interface FontPickerProps {
  selected: ScreenplayFont
  onSelect: (font: ScreenplayFont) => void
}

export function FontPicker({ selected, onSelect }: FontPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-text-2 hover:bg-surface-3 hover:text-text-1 w-auto md:w-[160px]" title={selected.name}>
          <span style={{ fontFamily: selected.family }} className="text-sm shrink-0">
            Aa
          </span>
          <span className="hidden md:inline truncate flex-1 text-left">{selected.name}</span>
          <ChevronDown size={10} className="opacity-50 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[280px]">
        {screenplayFonts.map((font) => (
          <DropdownMenuItem
            key={font.id}
            onSelect={() => onSelect(font)}
            className={`flex items-center justify-between gap-3 py-2.5 ${
              selected.id === font.id ? 'bg-border-1/50' : ''
            }`}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                style={{ fontFamily: font.family }}
                className={`text-sm truncate ${
                  selected.id === font.id ? 'text-text-1 font-medium' : ''
                }`}
              >
                {font.name}
              </span>
              <span className="text-xs text-text-3 leading-tight">
                {font.description}
              </span>
            </div>
            <span
              style={{ fontFamily: font.family }}
              className="text-xs text-text-3 whitespace-nowrap shrink-0"
            >
              INT. COFFEE SHOP
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
