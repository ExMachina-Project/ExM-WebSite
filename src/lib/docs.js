import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { DOCUMENTATION, getDocMeta } from '../data/documentation.js'
import { annotateHeadings, nodeText } from './markdown.js'

export const getDocument = cache(async (slug) => {
  const meta = getDocMeta(slug)
  if (!meta) return null
  const markdown = await readFile(path.join(process.cwd(), 'content', 'docs', `${meta.slug}.md`), 'utf8')
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const toc = annotateHeadings(tree)
  const sections = [{ title: meta.title, id: '', text: meta.description }]
  for (const node of tree.children) {
    if (node.type === 'heading') {
      sections.push({ title: nodeText(node), id: node.data.hProperties.id, text: '' })
    } else {
      sections[sections.length - 1].text += ` ${nodeText(node)}`
    }
  }
  return { ...meta, markdown, toc, sections }
})

export const getSearchIndex = cache(async () => {
  const docs = await Promise.all(DOCUMENTATION.map((meta) => getDocument(meta.slug)))
  return docs.flatMap((doc) => doc.sections.map((section) => ({
    title: section.title,
    docTitle: doc.title,
    href: `/docs/${doc.slug}${section.id ? `#${section.id}` : ''}`,
    text: section.text.trim(),
    tags: doc.tags.join(' '),
  })))
})
