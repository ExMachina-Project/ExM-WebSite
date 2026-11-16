'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { KeyboardEvent } from 'react'
import type { CSSVariables } from '../types/styles'

type NodeId = keyof typeof MOBILE_POSITIONS
type NodeState = 'NOMINAL' | 'ACTIVE' | 'IDLE' | 'BLOCKED' | 'ONLINE' | 'REVIEW'

interface TopologyNode {
  id: NodeId
  x: number
  y: number
  r: number
  label: string
  meta: string
  role: string
  state: NodeState
  desc: string
  warn?: boolean
}

const CORE: TopologyNode = { id: 'core', x: 430, y: 230, r: 25, label: 'EXM / CORE', meta: 'ORCHESTRATOR', role: '指挥体', state: 'NOMINAL', desc: '负责任务分解、个体调度与结果汇总。' }

const NODES: readonly TopologyNode[] = [
  CORE,
  { id: 'planner', x: 235, y: 130, r: 14, label: 'PLANNER-01', meta: 'DECOMPOSITION', role: '任务规划', state: 'ACTIVE', desc: '把目标拆成 DAG，为节点附带边界与验收口径。' },
  { id: 'executor', x: 625, y: 130, r: 14, label: 'EXECUTOR-02', meta: 'WORKSPACE', role: '实作执行', state: 'ACTIVE', desc: '在隔离工作区执行任务，工具调用受策略约束。' },
  { id: 'reviewer', x: 430, y: 78, r: 12, label: 'REVIEWER', meta: 'CONTRACT', role: '契约校验', state: 'IDLE', desc: '校验 SyncReport 结构与业务验收口径。' },
  { id: 'research', x: 260, y: 340, r: 13, label: 'RESEARCH-03', meta: 'EVIDENCE', role: '证据检索', state: 'ACTIVE', desc: '收集证据并标注 A–D 证据等级。' },
  { id: 'coder', x: 600, y: 340, r: 13, label: 'CODER-04', meta: 'APPROVAL', role: '代码执行', state: 'BLOCKED', desc: '写操作等待审批，批准后继续执行。', warn: true },
  { id: 'memory', x: 112, y: 230, r: 9, label: 'MEMORY', meta: 'SHARED / PRIVATE', role: '分层记忆', state: 'ONLINE', desc: '群体共享与个体私有记忆。' },
  { id: 'tools', x: 748, y: 230, r: 9, label: 'TOOLS', meta: 'GATEWAY', role: '工具网关', state: 'ONLINE', desc: '沙箱、白名单、审批和审计。' },
  { id: 'sync', x: 590, y: 52, r: 8, label: 'SYNC RPT', meta: '5 FIELDS', role: '契约回流', state: 'ONLINE', desc: '五字段结构化结果回流。' },
  { id: 'audit', x: 360, y: 420, r: 9, label: 'RISK / AUDIT', meta: 'POLICY', role: '风险审计', state: 'REVIEW', desc: '追踪风险、阻断与回退路径。', warn: true },
  { id: 'validator', x: 500, y: 430, r: 9, label: 'VALIDATOR', meta: 'SCHEMA CHECK', role: '结果校验', state: 'ONLINE', desc: '结构与业务双校验。' },
  { id: 'result', x: 430, y: 500, r: 8, label: 'RESULT BUS', meta: 'COMMIT', role: '结果总线', state: 'ACTIVE', desc: '任务结果与状态回流汇聚。' },
]

const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ['core', 'planner'], ['core', 'executor'], ['core', 'reviewer'], ['core', 'research'], ['core', 'coder'],
  ['planner', 'memory'], ['planner', 'sync'], ['executor', 'tools'], ['executor', 'sync'], ['research', 'audit'],
  ['coder', 'validator'], ['audit', 'result'], ['validator', 'result'], ['memory', 'research'], ['tools', 'coder'],
]

const MOBILE_POSITIONS = {
  core: [210, 265], reviewer: [210, 64], sync: [330, 64],
  planner: [100, 156], executor: [320, 156],
  memory: [64, 297], tools: [356, 297],
  research: [116, 392], coder: [304, 392],
  audit: [116, 493], validator: [304, 493], result: [210, 572],
} as const
const subscribeToViewport = (callback: () => void) => {
  const query = window.matchMedia('(max-width: 640px)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const getCompactSnapshot = () => window.matchMedia('(max-width: 640px)').matches
const getServerSnapshot = () => false

export default function ClusterTopology() {
  const [selectedId, setSelectedId] = useState<NodeId>('core')
  const [hoveredId, setHoveredId] = useState<NodeId | null>(null)
  const [pulse, setPulse] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [visible, setVisible] = useState(true)
  const compact = useSyncExternalStore(subscribeToViewport, getCompactSnapshot, getServerSnapshot)
  const labRef = useRef<HTMLDivElement>(null)
  const scanTimer = useRef<number | undefined>(undefined)
  const nodeRefs = useRef<Partial<Record<NodeId, SVGGElement | null>>>({})
  const selected = NODES.find((node) => node.id === selectedId) ?? CORE
  const focus = hoveredId || selectedId
  const neighbors = new Set([focus, ...EDGES.flatMap(([a, b]) => a === focus || b === focus ? [a, b] : [])])
  const nodes = NODES.map((node) => compact ? { ...node, x: MOBILE_POSITIONS[node.id][0], y: MOBILE_POSITIONS[node.id][1] } : node)
  const positions = new Map(nodes.map((node) => [node.id, node]))
  const corePosition = positions.get('core') ?? CORE
  const connections = EDGES.filter(([a, b]) => a === selectedId || b === selectedId).length

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => { if (entry) setVisible(entry.isIntersecting) }, { rootMargin: '80px' })
    if (labRef.current) observer.observe(labRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(scanTimer.current), [])

  const activate = (id: NodeId) => {
    window.clearTimeout(scanTimer.current)
    setSelectedId(id)
    setPulse((value) => value + 1)
    setScanning(true)
    scanTimer.current = window.setTimeout(() => setScanning(false), 850)
  }

  const handleNodeKey = (event: KeyboardEvent<SVGGElement>, node: TopologyNode, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(node.id)
    }
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0
    if (direction) {
      event.preventDefault()
      const next = nodes[(index + direction + nodes.length) % nodes.length]
      if (next) nodeRefs.current[next.id]?.focus()
    }
  }

  return (
    <div ref={labRef} className={`topology-lab${visible ? '' : ' is-offscreen'}`}>
      <div className="topology-lab-bar">
        <span className="lab-title"><i /> SWARM TOPOLOGY</span>
        <span className="lab-meta">{NODES.length} NODES · {EDGES.length} LINKS · <b>DEMO</b></span>
      </div>
      <div className={`topology-canvas${scanning ? ' is-scanning' : ''}`}>
        {['tl', 'tr', 'bl', 'br'].map((corner) => <span key={corner} className={`topology-corner topology-corner--${corner}`} aria-hidden="true" />)}
        <div className="topology-annotation topology-annotation--tl">LAYER 00 // COMMAND CORE<br /><b>CONTRACT-DRIVEN COLLABORATION</b></div>
        <div className="topology-annotation topology-annotation--tr">LOCAL MODEL<br />DETERMINISTIC PREVIEW</div>
        <svg viewBox={compact ? '0 0 420 640' : '0 0 860 550'} role="group" aria-label="ExMachina 交互式集群拓扑" aria-describedby="topology-help">
          <g aria-hidden="true">
            <circle className="topology-ring topology-ring--outer" cx={corePosition.x} cy={corePosition.y} r={compact ? 181 : 206} />
            <circle className="topology-ring" cx={corePosition.x} cy={corePosition.y} r={compact ? 129 : 142} />
            <circle className="topology-ring topology-ring--dash" cx={corePosition.x} cy={corePosition.y} r="72" />
            {EDGES.map(([a, b], index) => {
              const from = positions.get(a)
              const to = positions.get(b)
              if (!from || !to) return null
              const related = a === focus || b === focus
              const packetStyle: CSSVariables = { '--packet-delay': `${index * -.42}s` }
              return (
                <g key={`${a}-${b}`}>
                  <line className={`topology-edge${related ? ' is-related' : ' is-muted'}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                  {(related || index % 4 === 0) && <line className={`topology-packet${related ? ' is-related' : ''}`} style={packetStyle} x1={from.x} y1={from.y} x2={to.x} y2={to.y} pathLength="100" />}
                </g>
              )
            })}
          </g>
          {nodes.map((node, index) => {
            const active = node.id === selectedId
            const faded = !neighbors.has(node.id)
            const labelY = node.id === 'core' ? 79 : node.id === 'sync' ? -node.r - 29 : node.y < 180 ? -node.r * 2 - 22 : node.r + 25
            return (
              <g
                ref={(element) => { nodeRefs.current[node.id] = element }}
                className={`topology-node${active ? ' is-selected' : ''}${faded ? ' is-faded' : ''}${node.warn ? ' is-warn' : ''}${node.state === 'BLOCKED' ? ' is-blocked' : ''}`}
                key={node.id}
                transform={`translate(${node.x} ${node.y})`}
                tabIndex={0}
                role="button"
                aria-label={`${node.label}，${node.role}，状态 ${node.state}`}
                aria-pressed={active}
                onClick={() => activate(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
                onKeyDown={(event) => handleNodeKey(event, node, index)}
              >
                <circle className="topology-hit-area" r={node.id === 'core' ? 58 : 27} />
                <circle className="topology-halo" r={node.r * 2 + 7} />
                {node.id === 'core' && <circle className="topology-halo topology-halo--dash" r="39" />}
                <circle className="topology-core" r={node.r} />
                {node.warn ? <path className="topology-warn-mark" d="M-4-3 4 3M4-3-4 3" /> : <circle className="topology-pin" r={node.id === 'core' ? 3.2 : 2.5} />}
                {node.id === 'core' && <path className="topology-cross" d="M-8 0H8M0-8V8" />}
                {active && <circle key={pulse} className="topology-ripple" r={node.r + 9} />}
                <text className="topology-label" textAnchor="middle" y={labelY}>{node.label}</text>
                <text className="topology-meta" textAnchor="middle" y={labelY + 14}>{node.meta}</text>
              </g>
            )
          })}
        </svg>
        <div className="topology-annotation topology-annotation--bl">DISPATCH → EXECUTE → SYNC</div>
        <div className="topology-annotation topology-annotation--br">SELECT NODE TO INSPECT<br />CLICK / HOVER / TAB</div>
      </div>
      <div className="topology-node-picker" role="group" aria-label="选择编队节点">{NODES.map((node) => <button type="button" key={node.id} aria-pressed={node.id === selectedId} onClick={() => activate(node.id)}>{node.label}</button>)}</div>
      <div className="topology-inspector" aria-live="polite">
        <div className="topology-inspector-main"><span>SYSTEM ENTITY / {selected.role}</span><strong>{selected.label}</strong><p>{selected.desc}</p></div>
        <div className="topology-stat"><span>STATE</span><b className={selected.state === 'BLOCKED' ? 'is-blocked' : selected.warn ? 'is-warn' : ''}>{selected.state}</b></div>
        <div className="topology-stat"><span>CONNECTIONS</span><b>{String(connections).padStart(2, '0')} LINKS</b></div>
        <button type="button" onClick={() => activate(selected.id)}>重新扫描 ↗</button>
      </div>
      <div className="topology-legend"><span><i className="legend-dot legend-dot--active" /> ACTIVE</span><span><i className="legend-dot legend-dot--warn" /> ATTENTION</span><span><i className="legend-dot legend-dot--blocked" /> BLOCKED</span><span><i className="legend-line" /> DEPENDENCY FLOW</span></div>
      <p className="sr-only" id="topology-help">Tab 或方向键聚焦节点，Enter 或空格选择节点。选中后可查看职责、状态和连接数量。</p>
    </div>
  )
}
