import Link from 'next/link'
import BrandMark from '../../components/BrandMark.jsx'
import { GITHUB } from '../../site.js'

export const metadata = {
  title: '插件市场 · 即将开放 · ExMachina',
  description: 'ExMachina 插件市场将在未来提供。现在可以阅读插件开发指南，使用本地目录、CLI 或 WebUI 管理插件。',
}

const TYPES = [
  { id: 'T1', type: 'DECLARATIVE', title: '声明式插件', description: '用一份清单将现有 HTTP 接口连接到智能体工具面。', code: 'plugin.json → HTTP tool', hash: '最少实现 · 清单驱动' },
  { id: 'T2', type: 'PROCESS', title: '进程插件', description: '通过 stdio JSON-RPC 接入任意语言实现的工具与本地逻辑。', code: 'initialize → tools/call', hash: '独立进程 · 标准协议' },
  { id: 'T3', type: 'BUILT-IN', title: '内置插件', description: '通过 Rust trait 集成宿主能力，随项目版本构建与发布。', code: 'PluginProvider / Rust', hash: '深度集成 · 随宿主发布' },
]

export default function PluginsPage() {
  return (
    <main className="plugins-page" id="main-content">
      <div className="content-wrap">
        <div className="page-breadcrumb"><Link href="/">ExMachina</Link><span>/</span><span>插件市场</span></div>
        <header className="plugins-hero">
          <div><span className="section-eyebrow">PLUGINS / AN OPEN EXTENSION SURFACE</span><h1>让能力继续延伸。</h1><p>一个发现、了解和分享 ExMachina 插件的入口。<br />官网市场将在未来开放；今天，你已经可以开始构建自己的扩展。</p><div className="plugins-actions"><Link className="page-button page-button--primary" href="/docs/plugins">阅读插件开发指南 <span aria-hidden="true">↗</span></Link><a className="page-button" href={`${GITHUB}/tree/dev/plugins`} target="_blank" rel="noreferrer">查看插件源码 <span aria-hidden="true">↗</span></a></div></div>
          <div className="plugins-orbit" aria-hidden="true"><div className="plugin-orbit-ring" /><BrandMark /><span className="plugin-orbit-label plugin-orbit-label--one">TOOLS</span><span className="plugin-orbit-label plugin-orbit-label--two">CHANNEL</span><span className="plugin-orbit-label plugin-orbit-label--three">WATCH</span><span className="plugin-orbit-label plugin-orbit-label--four">RESOURCES</span></div>
        </header>

        <section className="market-status" aria-labelledby="market-status-title">
          <div className="market-status-bar"><span>MARKETPLACE / STATUS</span><span className="availability-badge">即将开放</span></div>
          <div className="market-empty-state"><span className="market-package-icon" aria-hidden="true"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1"><path d="m18 4 12 7v14l-12 7-12-7V11l12-7ZM6 11l12 7 12-7M18 18v14M12 7.5l12 7" /></svg></span><h2 id="market-status-title">目录尚未开放，扩展能力已在项目中。</h2><p>这里未来会成为插件发现入口。当前没有在线目录、安装或发布服务，也未设定公开上线日期。</p><Link href="/docs/plugins#安装与更新">查看当前可用的本地安装方式 <span aria-hidden="true">↗</span></Link></div>
          <div className="market-status-footer"><span>WEB MARKETPLACE / PLANNED</span><span>LOCAL PLUGIN SYSTEM / AVAILABLE IN PROJECT</span></div>
        </section>

        <section className="plugin-types" aria-labelledby="plugin-types-title">
          <div className="docs-section-heading"><span aria-hidden="true">##</span><h2 id="plugin-types-title">从适合的插件形态开始</h2></div>
          <p className="page-section-description">一份清单，按需声明 tools、channel、watch 与 resources。根据任务选择实现方式。</p>
          <div className="plugin-type-grid">{TYPES.map((item) => <article key={item.id}><div><span>{item.id}</span><small>{item.type}</small></div><h3>{item.title}</h3><p>{item.description}</p><code>{item.code}</code><span className="plugin-type-note">{item.hash}</span></article>)}</div>
        </section>

        <section className="plugin-get-started" aria-labelledby="plugin-now-title"><div><span className="section-eyebrow">BUILD NOW</span><h2 id="plugin-now-title">无需等待市场，先完成第一个插件。</h2><p>从最小清单开始，在本地验证装载、工具调用与权限边界，再选择合适的分发方式。</p><Link className="text-link" href="/docs/plugins">开始开发 <span>↗</span></Link></div><ol><li><span>01</span><div><h3>编写清单</h3><p>在插件目录创建 <code>plugin.json</code>，声明 ID、版本与能力。</p></div></li><li><span>02</span><div><h3>本地验证</h3><p>在项目 CLI 或 WebUI 中检查装载与调用状态。</p></div></li><li><span>03</span><div><h3>按需分发</h3><p>使用项目支持的本地包、Git 仓库或已配置的索引。</p></div></li></ol></section>

        <section className="plugin-resources" aria-label="插件相关文档"><Link href="/docs/plugins"><span>DEVELOPMENT</span><strong>插件开发指南 <i>↗</i></strong><p>清单、安装、进程协议与本地验收。</p></Link><Link href="/docs/security"><span>PERMISSIONS</span><strong>安全与权限 <i>↗</i></strong><p>执行策略、沙箱与敏感凭据的边界。</p></Link></section>
      </div>
    </main>
  )
}
