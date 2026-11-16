import { Children, isValidElement } from 'react'
import type { ComponentProps, ReactElement } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkHeadingIds } from '../lib/markdown'
import CopyCommand from './CopyCommand'

function CodeBlock({ children }: ComponentProps<'pre'>) {
  const code = Children.toArray(children).find((child): child is ReactElement<ComponentProps<'code'>> => isValidElement<ComponentProps<'code'>>(child) && child.type === 'code')
  const command = String(code?.props.children || '').replace(/\n$/, '')
  const language = code?.props.className?.replace('language-', '') || 'text'
  return (
    <div className="docs-code">
      <div className="docs-code-bar"><span>{language}</span><CopyCommand command={command} label="复制代码" className="code-copy" /></div>
      <pre tabIndex={0} aria-label={`${language} 代码示例`}>{children}</pre>
    </div>
  )
}

function heading(Tag: 'h2' | 'h3' | 'h4') {
  return function Heading({ id, children }: ComponentProps<'h2'>) {
    return <Tag id={id}><a className="heading-anchor" href={`#${id}`} aria-label="链接到此章节">#</a>{children}</Tag>
  }
}

const components: Components = {
  h2: heading('h2'), h3: heading('h3'), h4: heading('h4'),
  pre: CodeBlock,
  table: ({ children }) => <div className="docs-table" tabIndex={0} role="region" aria-label="文档表格"><table>{children}</table></div>,
  a: ({ href = '', children }) => href.startsWith('/')
    ? <Link href={href as Route}>{children}</Link>
    : <a href={href} target={/^https?:/.test(href) ? '_blank' : undefined} rel={/^https?:/.test(href) ? 'noreferrer' : undefined}>{children}</a>,
}

interface DocsMarkdownProps {
  source: string
}

export default function DocsMarkdown({ source }: DocsMarkdownProps) {
  return <div className="docs-prose"><Markdown skipHtml disallowedElements={['img']} remarkPlugins={[remarkGfm, remarkHeadingIds]} components={components}>{source}</Markdown></div>
}
