import GithubSlugger from 'github-slugger'
import type { Nodes, Root } from 'mdast'
import type { Plugin } from 'unified'
import type { DocHeading } from '../types/docs'

export function nodeText(node: Nodes): string {
  if ('value' in node && typeof node.value === 'string') return node.value
  return 'children' in node ? node.children.map(nodeText).join('') : ''
}

export function annotateHeadings(tree: Root): DocHeading[] {
  const slugger = new GithubSlugger()
  const headings: DocHeading[] = []
  const visit = (node: Nodes) => {
    if (node.type === 'heading') {
      const title = nodeText(node)
      const id = slugger.slug(title)
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
      headings.push({ id, title, level: node.depth })
    }
    if ('children' in node) node.children.forEach(visit)
  }
  visit(tree)
  return headings
}

export const remarkHeadingIds: Plugin<[], Root> = () => {
  return (tree) => { annotateHeadings(tree) }
}
