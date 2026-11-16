import Link from 'next/link'
import InstallCommand from '../components/InstallCommand.jsx'
import QuickStartCommands from '../components/QuickStartCommands.jsx'
import WorkflowDemo from '../components/WorkflowDemo.jsx'
import BrandMark from '../components/BrandMark.jsx'
import DataFlowBackground from '../components/DataFlowBackground.jsx'
import ClusterTopology from '../components/ClusterTopology.jsx'
import HeroSignal from '../components/HeroSignal.jsx'
import HomeEffects from '../components/HomeEffects.jsx'
import SystemGlyph from '../components/SystemGlyph.jsx'
import { DOCS, GITHUB } from '../site.js'

const PILLARS = [
  { number: '01', title: '任务，先被拆清楚', description: '指挥体把复杂目标编译成 DAG。每个节点都带边界、依赖和验收口径，不把模糊愿望直接广播给一群模型。', signal: 'PLAN → DISPATCH' },
  { number: '02', title: '结论，必须带着依据回来', description: '每个个体用 SyncReport 交卷：结论、证据等级、风险、阻塞与置信度。结构缺失会被校验，而不是被一段漂亮文字掩盖。', signal: 'EVIDENCE → VERIFY' },
  { number: '03', title: '分歧，不会被悄悄抹掉', description: '不同个体意见冲突时，系统追加裁决节点。选择理由、风险与回退路径一并留存，最终结果可以被重新检查。', signal: 'CONFLICT → JUDGE' },
]

const CAPABILITIES = [
  { type: 'swarm', title: '集体编排', description: '任务 DAG、拓扑调度、并发执行与节点级重试。让复杂目标沿清晰的依赖路径推进。', signal: 'ORCHESTRATION', tags: ['DAG', '并行执行', '契约回流'], href: '/docs/architecture' },
  { type: 'agent', title: '个人智能体', description: '轻任务直接对话，需要时再扩成一支协作队伍。', signal: 'SINGLE AGENT', tags: ['SOUL', '工具循环'], href: '/docs/usage' },
  { type: 'memory', title: '分层记忆', description: '个体私有与群体共享，在明确边界内积累经验。', signal: 'LAYERED MEMORY', tags: ['私有', '共享'], href: '/docs/architecture' },
  { type: 'tools', title: '受控工具', description: '沙箱、白名单、审批与调用审计，为执行划定边界。', signal: 'POLICY & AUDIT', tags: ['沙箱', '审批策略'], href: '/docs/security' },
  { type: 'connect', title: '开放接入', description: 'REST、WebSocket、多模型协议与 MCP。让已有工具接入你的智能体。', signal: 'OPEN INTERFACES', tags: ['MCP', 'REST / WS', '插件'], href: '/docs/plugins' },
  { type: 'local', title: '本地优先', description: '一个网关进程，项目数据留在自己的运行环境。', signal: 'LOCAL FIRST', tags: ['Rust', '你的运行环境'], href: '/docs/installation' },
]

const FLOW = [['01', '收拢', '锁定目标与约束'], ['02', '规划', '生成依赖 DAG'], ['03', '派发', '按能力分配任务'], ['04', '回流', '提交结构化结果'], ['05', '裁决', '显式处理冲突'], ['06', '收束', '结果与三账落库']]

function SectionIntro({ eyebrow, title, description }) {
  return <div className="section-intro"><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
}

export default function Page() {
  return (
    <>
      <main className="readme-site" id="main-content">
        <HomeEffects />
        <DataFlowBackground />
        <section className="hero" id="top" aria-labelledby="project-title">
          <div className="hero-topline"><span><i /> LOCAL-FIRST COLLECTIVE INTELLIGENCE</span><p className="readme-languages"><a href="#top" aria-current="true">中文</a><span>/</span><a href={`${GITHUB}/blob/dev/README_EN.md`} target="_blank" rel="noreferrer">EN ↗</a></p></div>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 id="project-title"><span className="sr-only">ExMachina — </span>一个目标，<br /><span className="hero-title-accent">一支智能编队。</span></h1>
              <p className="hero-description">从一个智能体，到一支专业编队。<br />让每个结论带着证据回来，让智能始终由你掌控。</p>
              <div className="hero-actions"><a className="page-button page-button--primary" href="#quickstart">开始构建 <span aria-hidden="true">↗</span></a><a className="page-button hero-source" href={GITHUB} target="_blank" rel="noreferrer"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.59c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>GitHub <span aria-hidden="true">↗</span></a></div>
              <div className="readme-badges"><span className="badge">RUST / STABLE</span><span className="badge">OPEN SOURCE / MIT</span><span className="badge">LOCAL FIRST</span></div>
            </div>
            <HeroSignal />
          </div>
          <div className="hero-bottom"><span>让我们摒弃拟人表达，让 AI 回归绝对理性。</span><a href="#quickstart">向下探索 <span aria-hidden="true">↓</span></a></div>
        </section>

        <div className="system-strip content-wrap" aria-label="项目特性"><span>BUILT TO WORK TOGETHER</span><div><span>Rust runtime</span><i /><span>多模型接入</span><i /><span>MCP 原生扩展</span><i /><span>本地运行</span></div><span aria-hidden="true">[ EXM / 001 ]</span></div>

        <section className="readme-section readme-section--quick" id="quickstart" data-reveal>
          <div className="quickstart-layout">
            <div className="quickstart-intro"><span className="section-eyebrow">01 / INITIALIZE</span><h2>从一条命令，<br />开始你的智械计划。</h2><p>使用预编译发行版，快速在本地启动。<br />连接自己的模型，让第一个智能体开始工作。</p><Link className="text-link" href="/docs/installation">完整安装指南 <span aria-hidden="true">↗</span></Link></div>
            <div className="readme-content"><QuickStartCommands /><p className="readme-note">安装后启动网关，在 <code>http://127.0.0.1:4173</code> 配置模型与 API 密钥。</p><div className="quickstart-requirements"><span>Linux / macOS / Windows</span><span>预编译安装 · 无需编译工具链</span></div></div>
          </div>
        </section>

        <section className="readme-section" id="modes" data-reveal>
          <span className="section-eyebrow">02 / TWO MODES. ONE SYSTEM.</span>
          <div className="readme-section-title"><h2>独立思考。<br className="mobile-break" /> 协同进化。</h2></div>
          <p>按任务的重量选择交互目标。两种形态共用记忆、模型、工具与 SOUL；日常工作直接执行，复杂工作按编队协作。</p>
          <div className="agent-modes">
            <article><div className="mode-card-top"><span className="mode-label">01 / SINGLE</span><span>专注一个任务</span></div><div className="mode-visual mode-visual--single" aria-hidden="true"><i /><i /><i /><BrandMark /></div><h3>轻任务，直接服务。</h3><p>系统提示、会话历史与工具循环，产出即回答。终端、文件、浏览器、MCP 和分层记忆全部可用。</p><code>输入 → 智能体 → 工具 → 回答</code></article>
            <article><div className="mode-card-top"><span className="mode-label">02 / COLLECTIVE</span><span>应对复杂目标</span></div><div className="mode-visual mode-visual--collective" aria-hidden="true"><i /><i /><i /><BrandMark /><span /><span /><span /><span /></div><h3>重任务，成军协作。</h3><p>指挥体锁定边界、拆分任务；专业子个体并行执行，通过结构化契约回流。冲突显式裁决，结果进入三账。</p><code>输入 → 编队 → 验收 → 收束</code></article>
          </div>
          <blockquote className="soul-note"><b>理性或感性，都只是一份 SOUL。</b> 人设是 <code>entities/</code> 下可编辑的数据。更换表达风格，记忆、工具与协作机制继续沿用。</blockquote>
        </section>

        <section className="section workflow-section" id="workflow" data-reveal>
          <div className="content-wrap">
            <SectionIntro eyebrow="03 / ORCHESTRATION IN MOTION" title="每一步协作，都有迹可循。" description="从一个目标到一份可验证的结果。播放任务轨迹，观察规划、执行、证据与裁决如何环环相扣。" />
            <WorkflowDemo />
            <p className="demo-caption"><span>交互式演示</span> 选择节点，或播放完整的任务路径。不会调用模型，也不会连接后端。</p>
          </div>
        </section>

        <section className="readme-section topology-section" id="topology" data-reveal><div className="readme-content"><div className="topology-heading"><div><span className="section-eyebrow">04 / THE SHAPE OF COLLABORATION</span><div className="readme-section-title"><h2>看见智能，如何连接。</h2></div></div><span className="section-chip"><i /> 交互式集群拓扑</span></div><p>点击节点检视职责与状态，沿依赖关系追踪数据流。<br />每个个体各司其职，每一次回流都有明确的路径。</p><ClusterTopology /><p className="readme-note">概念演示 · 支持点击、悬停和键盘操作，数据不连接实际集群。</p></div></section>

        <section className="section principles-section" id="principles" data-reveal>
          <div className="content-wrap principles-layout">
            <div className="principles-aside"><span className="section-eyebrow">05 / TRUST BY DESIGN</span><h2>能力值得信任，<br />因为过程可检验。</h2><p>组模式将复杂任务拆成可审计的组织行为。每项结论都应能回答：依据是什么、风险在哪、退路是什么。</p><a className="text-link" href="#architecture">了解系统架构 <span>↗</span></a><div className="aside-mark"><BrandMark /><span>CONTRACT<br />EVIDENCE / AUDIT</span></div></div>
            <div className="principle-list">{PILLARS.map((item) => <article className="principle" key={item.number}><span className="principle-number">{item.number}</span><div className="principle-content"><h3>{item.title}</h3><p>{item.description}</p><code>{item.signal}</code></div><span className="principle-arrow">↗</span></article>)}</div>
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities" data-reveal>
          <div className="content-wrap">
            <div className="capability-header"><SectionIntro eyebrow="06 / ENGINEERED AS A WHOLE" title="一套系统，完整的能力。" description="从单体到集体，模型、工具、记忆与执行策略始终相连。" /><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">查看源代码 <span>↗</span></a></div>
            <div className="capability-grid">{CAPABILITIES.map((item, index) => <Link className={`capability capability--${item.type}`} href={item.href} key={item.type}><div className="capability-top"><span className="capability-index">0{index + 1} / {item.signal}</span><span aria-hidden="true">↗</span></div><SystemGlyph className="capability-glyph" type={item.type} /><h3>{item.title}</h3><p>{item.description}</p><div className="capability-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link>)}</div>
          </div>
        </section>

        <section className="section flow-section" id="architecture" data-reveal>
          <div className="content-wrap">
            <SectionIntro eyebrow="07 / UNDER THE SURFACE" title="复杂协作，清晰内核。" description="Rust 核心运行时连接模型、记忆与工具网关。组模式按依赖推进，结构化结果沿同一条事件路径回流。" />
            <div className="flow-steps">{FLOW.map(([index, title, detail], i) => <article className={`flow-step${i === 2 ? ' flow-step--accent' : ''}`} key={index}><div className="flow-step-top"><span>{index}</span><i aria-hidden="true">{i < FLOW.length - 1 ? '→' : '↘'}</i></div><h3>{title}</h3><p>{detail}</p></article>)}</div>
            <div className="architecture-note"><span className="architecture-pulse" /><div><b>一个网关进程</b><span>REST / WebSocket / WebUI / CLI · fsdb 持久化 · 组与工作区隔离</span></div><Link href="/docs/architecture">架构详解 ↗</Link></div>
          </div>
        </section>

        <section className="section capabilities-detail-section" data-reveal>
          <div className="content-wrap deployment-grid">
            <div><span className="section-eyebrow">08 / YOUR MACHINE. YOUR RULES.</span><h2>智能的边界，<br />由你定义。</h2><p>CLI、WebUI 与网关来自同一套运行时。连接自己的模型，接入已有消息平台；数据留在你选择运行它的地方。</p><Link className="text-link" href="/docs/installation">阅读部署指南 <span>↗</span></Link></div>
            <div className="deploy-diagram"><div className="deploy-node deploy-node--root"><BrandMark /><span>EXMACHINA<br /><small>LOCAL GATEWAY</small></span></div><div className="deploy-lines" aria-hidden="true"><i /><i /><i /><i /></div><div className="deploy-nodes"><span>WEBUI</span><span>CLI</span><span>CHAT CHANNELS</span><span>REST / WS</span></div><div className="deploy-footer"><span>YOUR MACHINE / YOUR NETWORK</span><span>NO HOSTED ACCOUNT REQUIRED</span></div></div>
          </div>
        </section>

        <section className="section install-section" id="install" data-reveal>
          <div className="content-wrap install-layout"><div><span className="section-eyebrow">BUILD / DEPLOY</span><h2>构建与部署</h2><p>Linux、macOS 或 Windows。使用安装引导脚本选择预编译版本或源码构建。</p><div className="install-details"><span><i /> Linux / macOS / Windows</span><span><i /> MIT License</span><span><i /> 可选预编译安装</span></div></div><div className="install-panel"><div className="install-panel-heading"><span><i /> INSTALLER</span><span>LOCAL FIRST</span></div><InstallCommand /><div className="install-panel-footer"><span>首次运行后，在「模型」页面添加提供商与 API 密钥。</span><Link href="/docs/installation">其他安装方式 ↗</Link></div></div></div>
        </section>

        <section className="section docs-section" id="docs" data-reveal>
          <div className="content-wrap"><div className="docs-heading"><div><span className="section-eyebrow">09 / OPEN THE MANUAL</span><h2>理解它，<br />然后构建你的可能。</h2></div><Link className="text-link" href="/docs">进入文档中心 <span>↗</span></Link></div><div className="docs-grid">{DOCS.map((doc) => <Link className="doc-link" key={doc.id} href={doc.url}><span className="doc-index">{doc.id} / DOCUMENTATION</span><b>{doc.title}<i>↗</i></b><span>{doc.desc}</span></Link>)}</div></div>
        </section>
        <section className="readme-section homepage-market" data-reveal>
          <div><span className="section-eyebrow">10 / AN OPEN HORIZON</span><h2>下一种能力，<br />由你创造。</h2><p>从一个插件开始，扩展智能的边界。<br />插件市场即将开放，现在就能构建自己的扩展。</p><div className="market-home-actions"><Link className="page-button page-button--primary" href="/docs/plugins">开始开发插件 <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/plugins">了解插件生态 <span>↗</span></Link></div></div>
          <div className="market-home-visual" aria-hidden="true"><span className="market-home-orbit" /><span className="market-home-orbit market-home-orbit--two" /><svg width="120" height="120" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1"><path d="m40 8 28 16v32L40 72 12 56V24L40 8ZM12 24l28 16 28-16M40 40v32M26 16l28 16v16" /></svg><span className="market-home-label">PLUGIN ECOSYSTEM</span><span className="availability-badge">即将开放</span></div>
        </section>
      </main>

    </>
  )
}
