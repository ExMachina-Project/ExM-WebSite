import GithubSlugger from 'github-slugger'

export function nodeText(node) {
  if (typeof node.value === 'string') return node.value
  return (node.children || []).map(nodeText).join('')
}

export function annotateHeadings(tree) {
  const slugger = new GithubSlugger()
  const headings = []
  const visit = (node) => {
    if (node.type === 'heading') {
      const title = nodeText(node)
      const id = slugger.slug(title)
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
      headings.push({ id, title, level: node.depth })
    }
    node.children?.forEach(visit)
  }
  visit(tree)
  return headings
}

export function remarkHeadingIds() {
  return (tree) => { annotateHeadings(tree) }
}
