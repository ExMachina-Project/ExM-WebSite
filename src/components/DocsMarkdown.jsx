import { Children, isValidElement } from 'react'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkHeadingIds } from '../lib/markdown.js'
import CopyCommand from './CopyCommand.jsx'

function CodeBlock({ children }) {
  const code = Children.toArray(children).find(isValidElement)
  const command = String(code?.props.children || '').replace(/\n$/, '')
  const language = code?.props.className?.replace('language-', '') || 'text'
  return (
    <div className="docs-code">
      <div className="docs-code-bar"><span>{language}</span><CopyCommand command={command} label="复制代码" className="code-copy" /></div>
      <pre tabIndex={0} aria-label={`${language} 代码示例`}>{children}</pre>
    </div>
  )
}

function heading(Tag) {
  return function Heading({ id, children }) {
    return <Tag id={id}><a className="heading-anchor" href={`#${id}`} aria-label="链接到此章节">#</a>{children}</Tag>
  }
}

const components = {
  h2: heading('h2'), h3: heading('h3'), h4: heading('h4'),
  pre: CodeBlock,
  table: ({ children }) => <div className="docs-table" tabIndex={0} role="region" aria-label="文档表格"><table>{children}</table></div>,
  a: ({ href = '', children }) => href.startsWith('/')
    ? <Link href={href}>{children}</Link>
    : <a href={href} target={/^https?:/.test(href) ? '_blank' : undefined} rel={/^https?:/.test(href) ? 'noreferrer' : undefined}>{children}</a>,
}

export default function DocsMarkdown({ source }) {
  return <div className="docs-prose"><Markdown skipHtml disallowedElements={['img']} remarkPlugins={[remarkGfm, remarkHeadingIds]} components={components}>{source}</Markdown></div>
}
