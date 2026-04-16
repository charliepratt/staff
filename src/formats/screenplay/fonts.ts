export interface ScreenplayFont {
  id: string
  name: string
  family: string
  description: string
}

export const screenplayFonts: ScreenplayFont[] = [
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    family: '"Courier Prime", "Courier New", Courier, monospace',
    description: 'The modern standard. Designed for screenplays.',
  },
  {
    id: 'courier-new',
    name: 'Courier New',
    family: '"Courier New", Courier, monospace',
    description: 'The classic. Required by some competitions.',
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    family: '"IBM Plex Mono", "Courier New", Courier, monospace',
    description: 'Modern and clean. A refined alternative.',
  },
  {
    id: 'special-elite',
    name: 'Special Elite',
    family: '"Special Elite", "Courier New", Courier, monospace',
    description: 'Vintage typewriter. Full of character.',
  },
]

export const defaultFont = screenplayFonts[0]!
