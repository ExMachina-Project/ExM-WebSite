import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { DOCUMENTATION, getDocMeta } from '../data/documentation'
import { annotateHeadings, nodeText } from './markdown'
import type { Document, DocSearchEntry, DocSection } from '../types/docs'

export const getDocument = cache(async (slug: string): Promise<Document | null> => {
  const meta = getDocMeta(slug)
  if (!meta) return null
  const markdown = await readFile(path.join(process.cwd(), 'content', 'docs', `${meta.slug}.md`), 'utf8')
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const toc = annotateHeadings(tree)
  let section: DocSection = { title: meta.title, id: '', text: meta.description }
  const sections: DocSection[] = [section]
  for (const node of tree.children) {
    if (node.type === 'heading') {
      const id = node.data?.hProperties?.id
      if (typeof id !== 'string') throw new Error(`Missing heading ID in document: ${slug}`)
      section = { title: nodeText(node), id, text: '' }
      sections.push(section)
    } else {
      section.text += ` ${nodeText(node)}`
    }
  }
  return { ...meta, markdown, toc, sections }
})

export const getSearchIndex = cache(async (): Promise<DocSearchEntry[]> => {
  const docs = await Promise.all(DOCUMENTATION.map((meta) => getDocument(meta.slug)))
  return docs.flatMap((doc) => {
    if (!doc) throw new Error('A registered document is missing from the search index')
    const path = `/docs/${doc.slug}` as const
    return doc.sections.map((section): DocSearchEntry => ({
      title: section.title,
      docTitle: doc.title,
      href: section.id ? `${path}#${section.id}` : path,
      text: section.text.trim(),
      tags: doc.tags.join(' '),
    }))
  })
})
