export interface ScreenplayFont {
  id: string
  name: string
  family: string
  category: 'monospace' | 'sans-serif' | 'serif'
  description: string
}

export const screenplayFonts: ScreenplayFont[] = [
  // — Monospace / Typewriter —
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    family: '"Courier Prime", "Courier New", Courier, monospace',
    category: 'monospace',
    description: 'Designed for screenplays. The modern standard.',
  },
  {
    id: 'courier-new',
    name: 'Courier New',
    family: '"Courier New", Courier, monospace',
    category: 'monospace',
    description: 'The classic. What your typewriter would use.',
  },
  {
    id: 'cousine',
    name: 'Cousine',
    family: '"Cousine", "Courier New", Courier, monospace',
    category: 'monospace',
    description: 'Clean Courier alternative. Crisp and legible.',
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    family: '"IBM Plex Mono", "Courier New", Courier, monospace',
    category: 'monospace',
    description: 'Modern monospace. A little more refined.',
  },
  {
    id: 'cutive-mono',
    name: 'Cutive Mono',
    family: '"Cutive Mono", "Courier New", Courier, monospace',
    category: 'monospace',
    description: 'Warm typewriter feel. Smith-Premier inspired.',
  },
  {
    id: 'special-elite',
    name: 'Special Elite',
    family: '"Special Elite", "Courier New", Courier, monospace',
    category: 'monospace',
    description: 'Vintage typewriter. Full of character.',
  },

  // — Sans Serif —
  {
    id: 'inter',
    name: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    category: 'sans-serif',
    description: 'Supreme readability. Born for screens.',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: '"DM Sans", system-ui, sans-serif',
    category: 'sans-serif',
    description: 'Geometric and warm. Effortlessly modern.',
  },
  {
    id: 'source-sans',
    name: 'Source Sans 3',
    family: '"Source Sans 3", system-ui, sans-serif',
    category: 'sans-serif',
    description: "Adobe's workhorse. Clarity at every size.",
  },

  // — Serif —
  {
    id: 'literata',
    name: 'Literata',
    family: '"Literata", Georgia, serif',
    category: 'serif',
    description: 'Made for long-form reading. Google Books font.',
  },
]

export const defaultFont = screenplayFonts[0]!
