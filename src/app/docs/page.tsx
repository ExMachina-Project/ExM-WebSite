import Link from 'next/link'
import type { Metadata } from 'next'
import DocsSearch from '../../components/DocsSearch'
import { DOCUMENTATION, DOCUMENTATION_GROUPS } from '../../data/documentation'
import { getSearchIndex } from '../../lib/docs'

export const metadata: Metadata = {
  title: '文档中心 · ExMachina',
  description: '从安装与模型接入到协作编排、插件开发与安全配置，在站内阅读 ExMachina 文档。',
}

const PATHS = [
  { id: '01', title: '第一次运行', description: '安装并连接模型，完成第一条任务。', links: [['安装指南', '/docs/installation'], ['使用指南', '/docs/usage']] },
  { id: '02', title: '理解编队机制', description: '从分层架构走到规划、回流与三账。', links: [['架构与设计', '/docs/architecture'], ['协议与契约', '/docs/contracts']] },
  { id: '03', title: '扩展自己的系统', description: '编写插件，配置权限与执行边界。', links: [['插件开发', '/docs/plugins'], ['安全与权限', '/docs/security']] },
] as const

export default async function DocumentationPage() {
  const index = await getSearchIndex()

  return (
    <main className="docs-overview" id="main-content">
      <div className="page-breadcrumb"><Link href="/">ExMachina</Link><span>/</span><span>文档</span></div>
      <header className="docs-page-header">
        <span className="section-eyebrow">DOCUMENTATION / READ THE SYSTEM</span>
        <h1>从第一条命令，<br /><span>到每一个运行机制。</span></h1>
        <p>按你的进度开始。先在本地运行，再理解单个智能体与编队协作，最后扩展自己的工具与工作流。</p>
        <div className="docs-header-meta"><span>中文文档</span><i /><span>{DOCUMENTATION.length} 篇指南</span><i /><span>示例代码可复制</span></div>
      </header>

      <DocsSearch index={index} />

      <section className="docs-learning-paths" aria-labelledby="learning-paths-title">
        <div className="docs-section-heading"><span aria-hidden="true">##</span><h2 id="learning-paths-title">选择一条阅读路径</h2></div>
        <div className="learning-path-grid">{PATHS.map((item) => <article key={item.id}><span className="learning-path-index">{item.id} / START HERE</span><h3>{item.title}</h3><p>{item.description}</p><div>{item.links.map(([label, href]) => <Link href={href} key={href}>{label} <span aria-hidden="true">↗</span></Link>)}</div></article>)}</div>
      </section>

      <section className="docs-directory" aria-labelledby="all-documents-title">
        <div className="docs-section-heading"><span aria-hidden="true">##</span><h2 id="all-documents-title">全部文档</h2><span className="docs-directory-count">{String(DOCUMENTATION.length).padStart(2, '0')} DOCUMENTS</span></div>
        {DOCUMENTATION_GROUPS.map((group) => <div className="docs-directory-group" key={group}><h3>{group}</h3><div>{DOCUMENTATION.filter((doc) => doc.group === group).map((doc) => <Link href={`/docs/${doc.slug}`} key={doc.slug}><div><strong>{doc.title}</strong><p>{doc.description}</p></div><span aria-hidden="true">↗</span></Link>)}</div></div>)}
      </section>

      <aside className="docs-overview-note"><span>关于这些文档</span><p>本站指南根据项目 README 与专题文档整理。完整的 API、配置项和版本细节可通过每篇文章中的「仓库原文」查看。</p><Link href="/docs/plugins">准备开发插件？从清单和生命周期开始 ↗</Link></aside>
    </main>
  )
}
