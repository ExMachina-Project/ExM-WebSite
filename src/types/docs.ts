import type { Route } from 'next'
import type { DocMetadata, DocSlug } from '../data/documentation'

export type DocHref = Route<`/docs/${DocSlug}` | `/docs/${DocSlug}#${string}`>

export interface DocHeading {
  id: string
  title: string
  level: number
}

export interface DocSection {
  title: string
  id: string
  text: string
}

export type Document = DocMetadata & {
  markdown: string
  toc: DocHeading[]
  sections: DocSection[]
}

export interface DocSearchEntry {
  title: string
  docTitle: string
  href: DocHref
  text: string
  tags: string
}
