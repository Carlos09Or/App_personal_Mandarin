import raw from './hsk1.json'

export type Example = { hanzi: string; pinyin: string; en: string; es: string }
export type Word = {
  n: number
  hanzi: string
  pinyin: string
  en: string
  note: string
  /** Spanish versions, kept for a possible language switch; the app shows English. */
  es: string
  noteEs: string
  example: Example
}
export type Unit = {
  id: number
  title: string
  description: string
  titleEs: string
  descriptionEs: string
  words: number[]
}
export type CharInfo = { radical: string | null; components: string[]; clue: string }

export type NodeKind = 'lesson' | 'checkpoint'
export type PathNode = {
  id: string
  unitId: number
  /** Position inside the unit, 0-based. */
  index: number
  kind: NodeKind
  /** New words for a lesson; every word of the course for a checkpoint. */
  words: number[]
}

export const WORDS: Word[] = raw.words
export const UNITS: Unit[] = raw.units
export const CHARS: Record<string, CharInfo> = raw.chars
export const RADICALS: Record<string, string> = raw.radicals

const byNumber = new Map(WORDS.map((w) => [w.n, w]))
export const word = (n: number): Word => byNumber.get(n)!

/** Words in one door (lesson). */
export const LESSON_SIZE = 15
/**
 * Personal study copy: the whole course (all 300 HSK 1 words, in the order of the ten themed units) is walked through
 * Panama, province 1: 20 doors of 15 words, then the checkpoint. The themed units stay as review decks.
 */
const JOURNEY_UNIT = 1

export const UNIT_ACCENTS = [
  { bg: '#e0453a', dark: '#b3322a', soft: '#fde8e4' },
  { bg: '#2f9e7e', dark: '#1f7a5f', soft: '#e1f4ec' },
  { bg: '#e9a23b', dark: '#bf7c1c', soft: '#fcf0dc' },
  { bg: '#3b82c4', dark: '#2a639b', soft: '#e3eef9' },
  { bg: '#8a5cc2', dark: '#6b4398', soft: '#efe7f8' },
  { bg: '#d9577f', dark: '#ae3d60', soft: '#fbe5ec' },
  { bg: '#3a9aa8', dark: '#287783', soft: '#e0f2f4' },
  { bg: '#c46a3b', dark: '#9b4f29', soft: '#f8e9df' },
  { bg: '#5b8f3a', dark: '#456e2b', soft: '#e7f1df' },
  { bg: '#6b6fd0', dark: '#5054a6', soft: '#e8e9f9' },
]
export const accentFor = (unitId: number) => UNIT_ACCENTS[(unitId - 1) % UNIT_ACCENTS.length]

function journeyNodes(): PathNode[] {
  const all = UNITS.flatMap((u) => u.words)
  const nodes: PathNode[] = []
  for (let i = 0; i < all.length; i += LESSON_SIZE) {
    nodes.push({
      id: `u${JOURNEY_UNIT}-l${i / LESSON_SIZE + 1}`,
      unitId: JOURNEY_UNIT,
      index: nodes.length,
      kind: 'lesson',
      words: all.slice(i, i + LESSON_SIZE),
    })
  }
  nodes.push({ id: `u${JOURNEY_UNIT}-cp`, unitId: JOURNEY_UNIT, index: nodes.length, kind: 'checkpoint', words: all })
  return nodes
}

export const PATH: PathNode[] = journeyNodes()
export const nodesOfUnit = (unitId: number) => PATH.filter((p) => p.unitId === unitId)
export const nodeById = (id: string) => PATH.find((p) => p.id === id)

/** Han characters of a word, in order, without repeats. */
export const charsOf = (hanzi: string) => [...new Set([...hanzi].filter((c) => /\p{Script=Han}/u.test(c)))]

/** Pinyin without tone marks, for comparisons. */
export const plainPinyin = (p: string) =>
  p.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '')

const vocab = new Map(WORDS.map((w) => [w.hanzi, w]))
const longest = Math.max(...WORDS.map((w) => [...w.hanzi].length))

/**
 * Splits a sentence into HSK 1 words, longest match first, ignoring punctuation.
 * Returns null when some part isn't in the vocabulary.
 */
export function segment(sentence: string): string[] | null {
  const chars = [...sentence.replace(/[，。？！、：；“”‘’,.?!:;\s]/g, '')]
  const tokens: string[] = []
  let i = 0
  while (i < chars.length) {
    let len = Math.min(longest, chars.length - i)
    while (len > 0 && !vocab.has(chars.slice(i, i + len).join(''))) len--
    if (!len) return null
    tokens.push(chars.slice(i, i + len).join(''))
    i += len
  }
  return tokens
}

/** Pinyin for a vocabulary token (first reading when there are two). */
export const tokenPinyin = (token: string) => vocab.get(token)?.pinyin.split('/')[0] ?? ''
