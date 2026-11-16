import Link from 'next/link'
import { notFound } from 'next/navigation'
import DocsMarkdown from '../../../components/DocsMarkdown.jsx'
import DocsToc from '../../../components/DocsToc.jsx'
import { DOCUMENTATION, getDocMeta } from '../../../data/documentation.js'
import { getDocument } from '../../../lib/docs.js'
import { GITHUB } from '../../../site.js'

export const dynamicParams = false

export function generateStaticParams() {
  return DOCUMENTATION.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) return { title: '文档未找到 · ExMachina' }
  return { title: `${doc.title} · ExMachina 文档`, description: doc.description }
}

export default async function DocumentPage({ params }) {
  const { slug } = await params
  const doc = await getDocument(slug)
  if (!doc) notFound()
  const index = DOCUMENTATION.findIndex((entry) => entry.slug === slug)
  const previous = DOCUMENTATION[index - 1]
  const next = DOCUMENTATION[index + 1]

  return (
    <main className="docs-reader" id="main-content">
      <article className="docs-article">
        <div className="page-breadcrumb"><Link href="/docs">文档</Link><span>/</span><span>{doc.group}</span></div>
        <header className="docs-article-header"><span className="section-eyebrow">{doc.slug.toUpperCase()} / GUIDE</span><h1>{doc.title}</h1><p>{doc.description}</p><div className="docs-article-meta"><span>站内阅读指南</span><a href={`${GITHUB}/blob/dev/docs/${doc.source}`} target="_blank" rel="noreferrer">仓库原文 ↗</a></div></header>
        <details className="docs-mobile-toc"><summary>本页内容 <span aria-hidden="true">+</span></summary><nav aria-label="本页章节">{doc.toc.filter((item) => item.level === 2).map((item) => <a href={`#${item.id}`} key={item.id}>{item.title}</a>)}</nav></details>
        <DocsMarkdown source={doc.markdown} />
        <div className="docs-article-source"><p>需要完整字段、接口和最新版本细节？</p><a href={`${GITHUB}/blob/dev/docs/${doc.source}`} target="_blank" rel="noreferrer">查看项目仓库中的《{doc.source.replace(/\.md$/, '')}》↗</a></div>
        <nav className="docs-pagination" aria-label="文章翻页">
          {previous ? <Link href={`/docs/${previous.slug}`}><span>← 上一篇</span><strong>{previous.title}</strong></Link> : <Link href="/docs"><span>← 返回目录</span><strong>文档中心</strong></Link>}
          {next ? <Link href={`/docs/${next.slug}`}><span>下一篇 →</span><strong>{next.title}</strong></Link> : <Link href="/plugins"><span>了解扩展 →</span><strong>插件市场预告</strong></Link>}
        </nav>
      </article>
      <DocsToc key={doc.slug} headings={doc.toc} />
    </main>
  )
}
