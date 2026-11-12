import type { MediaImage } from './strapi'

export type Tone = 'default' | 'muted' | 'dark' | null

export type Highlight = {
  id?: number
  icon?: string | null
  title: string
  text?: string | null
  link?: string | null
}

export type HeroData = {
  variant?: 'overlay' | 'split' | 'intro' | null
  eyebrow?: string | null
  title?: string
  message?: string
  callToAction?: string
  link?: string
  secondaryCallToAction?: string | null
  secondaryLink?: string | null
  background?: MediaImage
  highlight?: 'dark' | 'light' | 'none'
  highlights?: Highlight[]
}

export type SplitData = {
  eyebrow?: string | null
  heading: string
  body?: string | null
  asideTitle?: string | null
  asideItems?: string | null
  facts?: Highlight[]
  tone?: Tone
}

export type CardsData = {
  eyebrow?: string | null
  heading: string
  intro?: string | null
  cards?: { id?: number, title: string, text: string }[]
  style?: 'plain' | 'numbered' | 'tinted' | null
  centered?: boolean | null
  tone?: Tone
}

export type QuoteData = { eyebrow?: string | null, quote: string, tone?: Tone }

export type CtaData = { heading: string, text?: string | null, buttonLabel?: string | null, link?: string | null, tone?: Tone }
