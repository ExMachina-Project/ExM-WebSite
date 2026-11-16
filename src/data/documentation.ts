interface DocumentationEntry {
  slug: string
  title: string
  group: string
  description: string
  shortDescription: string
  source: string
  tags: readonly string[]
}

export const DOCUMENTATION = [
  {
    slug: 'installation', title: '安装指南', group: '开始使用',
    description: '安装、构建、启动网关与连接模型，完成第一次运行。',
    shortDescription: '环境要求 · 本地安装 · 首次配置',
    source: '安装指南.md', tags: ['安装', '部署', 'Docker', '模型', '快速开始'],
  },
  {
    slug: 'usage', title: '使用指南', group: '开始使用',
    description: '理解交互目标、会话与编队，掌握 CLI 和日常协作流程。',
    shortDescription: 'CLI · 会话 · 智能体与编队',
    source: '使用指南.md', tags: ['CLI', '命令', '使用', '会话', '记忆', 'SOUL'],
  },
  {
    slug: 'architecture', title: '架构与设计', group: '核心机制',
    description: '从网关到编排运行时，理解调度、记忆、三账与持久化边界。',
    shortDescription: '分层架构 · DAG · 三账',
    source: '架构与设计.md', tags: ['Rust', '架构', 'DAG', '记忆', '调度'],
  },
  {
    slug: 'contracts', title: '协议与契约', group: '核心机制',
    description: '规划、派发与回流的结构约定，以及证据分级和冲突裁决。',
    shortDescription: '规划 · 派发 · 结构化回流',
    source: '协议与契约.md', tags: ['协议', '契约', 'SyncReport', 'API', '证据'],
  },
  {
    slug: 'plugins', title: '插件开发指南', group: '扩展与配置',
    description: '选择插件形态，编写清单，并通过 CLI 管理本地插件。',
    shortDescription: 'plugin.json · 开发 · 安装与更新',
    source: '插件开发指南.md', tags: ['插件', 'plugin', '清单', 'HTTP', 'JSON-RPC', '扩展'],
  },
  {
    slug: 'security', title: '安全与权限', group: '扩展与配置',
    description: '了解访问密钥、执行审批、沙箱和插件凭据的配置边界。',
    shortDescription: '访问控制 · 执行审批 · 沙箱',
    source: '安全模型.md', tags: ['安全', '权限', '审批', '沙箱', '凭据'],
  },
] as const satisfies readonly DocumentationEntry[]

export type DocMetadata = (typeof DOCUMENTATION)[number]
export type DocSlug = DocMetadata['slug']

export const DOCUMENTATION_GROUPS = [...new Set(DOCUMENTATION.map((doc) => doc.group))]

export function getDocMeta(slug: string): DocMetadata | undefined {
  return DOCUMENTATION.find((doc) => doc.slug === slug)
}
