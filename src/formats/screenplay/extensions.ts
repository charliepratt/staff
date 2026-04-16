import { SceneHeading } from '../../editor/extensions/SceneHeading'
import { Action } from '../../editor/extensions/Action'
import { Character } from '../../editor/extensions/Character'
import { Dialogue } from '../../editor/extensions/Dialogue'
import { Parenthetical } from '../../editor/extensions/Parenthetical'
import { Transition } from '../../editor/extensions/Transition'
import { ScreenplayKeymap } from '../../editor/extensions/ScreenplayKeymap'

export const screenplayExtensions = [
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
  ScreenplayKeymap,
]

export type ScreenplayElement =
  | 'sceneHeading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'

export const screenplayElements: { type: ScreenplayElement; label: string; shortcut: string }[] = [
  { type: 'sceneHeading', label: 'Scene Heading', shortcut: '1' },
  { type: 'action', label: 'Action', shortcut: '2' },
  { type: 'character', label: 'Character', shortcut: '3' },
  { type: 'dialogue', label: 'Dialogue', shortcut: '4' },
  { type: 'parenthetical', label: 'Parenthetical', shortcut: '5' },
  { type: 'transition', label: 'Transition', shortcut: '6' },
]
