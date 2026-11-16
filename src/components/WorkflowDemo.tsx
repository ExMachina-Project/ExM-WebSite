'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { id: 'planner', time: '00:00', name: 'PLANNER-01', state: '规划', tone: 'active', code: 'PLAN', message: '锁定任务边界，生成 OrchestratorPlan', detail: 'L2 并行 · 4 个节点 · 验收口径已附带' },
  { id: 'plan-ok', time: '00:01', name: 'ORCHESTRATOR', state: '已完成', tone: 'done', code: 'PLAN_OK', message: 'DAG 编译完成，生成 3 个派发单', detail: '每个派发单包含边界、依赖与验收条件' },
  { id: 'research', time: '00:02', name: 'RESEARCH-03', state: '检索', tone: 'active', code: 'DISPATCH', message: '研究个体开始收集外部证据', detail: '来源、置信度与证据等级随结果返回' },
  { id: 'evidence', time: '00:04', name: 'RESEARCH-03', state: '已回流', tone: 'done', code: 'SYNC_OK', message: 'SyncReport 通过契约校验', detail: '结论 / 证据 / 风险 / 阻塞 / 置信度' },
  { id: 'coder', time: '00:05', name: 'CODER-04', state: '执行', tone: 'active', code: 'EXEC', message: '实作个体进入隔离工作区', detail: '文件、命令与工具调用受执行策略约束' },
  { id: 'conflict', time: '00:07', name: 'ORCHESTRATOR', state: '待裁决', tone: 'warn', code: 'CONFLICT', message: '方案出现分歧，系统没有静默合并', detail: '分歧与双方依据保留在任务记录中' },
  { id: 'judge', time: '00:09', name: 'JUDGE-01', state: '裁决', tone: 'active', code: 'JUDGE', message: '追加裁决节点，给出选择与回退路径', detail: '裁决依据进入风险账，可回看可追溯' },
  { id: 'commit', time: '00:16', name: 'ORCHESTRATOR', state: '已收束', tone: 'done', code: 'COMMIT', message: '结果、证据与风险账原子落库', detail: '所有节点完成 · 结论具备完整依据链' },
] as const

const AGENTS = [
  ['EX', 'ORCHESTRATOR', '拆解 / 调度'],
  ['P1', 'PLANNER-01', 'DAG 规划'],
  ['R3', 'RESEARCH-03', '证据检索'],
  ['C4', 'CODER-04', '隔离实作'],
] as const

export default function WorkflowDemo() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = STEPS[active] ?? STEPS[0]
  const visibleSteps = STEPS.slice(Math.min(Math.max(0, active - 2), STEPS.length - 5), Math.min(Math.max(0, active - 2), STEPS.length - 5) + 5)

  useEffect(() => {
    if (!playing) return undefined
    const timer = window.setTimeout(() => {
      const next = Math.min(active + 1, STEPS.length - 1)
      setActive(next)
      if (next === STEPS.length - 1) setPlaying(false)
    }, 1250)
    return () => window.clearTimeout(timer)
  }, [playing, active])

  const play = () => {
    if (active >= STEPS.length - 1) setActive(0)
    setPlaying(true)
  }

  return (
    <div className="workflow-demo">
      <div className="workflow-chrome">
        <div className="chrome-brand"><span className="chrome-mark">EX</span><span><b>协作运行记录</b><small>RUN / 8F2A · LOCAL SESSION</small></span></div>
        <span className="chrome-status"><i /> {playing ? 'RUNNING' : active === STEPS.length - 1 ? 'COMPLETED' : 'READY'}</span>
      </div>
      <div className="workflow-layout">
        <div className="workflow-rail">
          <div className="workflow-rail-heading"><span>执行编队</span><span>01 指挥 · 03 个体</span></div>
          {AGENTS.map(([initial, name, role]) => <div className={`workflow-agent${step.name.includes(name.split('-')[0] ?? name) ? ' is-current' : ''}`} key={name}><span>{initial}</span><div><b>{name}</b><small>{role}</small></div><i /></div>)}
          <div className="workflow-ledgers"><span>任务账 <b>{active > 0 ? '03' : '00'}</b></span><span>证据账 <b>{active >= 3 ? '03' : '00'}</b></span><span>风险账 <b>{active >= 5 ? '01' : '00'}</b></span></div>
        </div>
        <div className="workflow-stream">
          <div className="stream-heading"><span>EVENT STREAM</span><span>任务节点按契约回流</span></div>
          <div className="stream-events" aria-label="任务执行路径">
            {visibleSteps.map((event) => {
              const index = STEPS.indexOf(event)
              return <button type="button" className={`stream-event tone-${event.tone}${event.id === step.id ? ' is-current' : ''}${index > active ? ' is-upcoming' : ''}`} aria-label={`查看第 ${index + 1} 步：${event.message}`} aria-current={index === active ? 'step' : undefined} key={event.id} onClick={() => { setPlaying(false); setActive(index) }}>
                <time>{event.time}</time><span className="stream-event-dot" /><span className="stream-event-copy"><b>{event.message}</b><small>{event.detail}</small></span><code>{event.code}</code>
              </button>
            })}
          </div>
          <div className="stream-summary" aria-live="polite"><div className="summary-head"><span>STRUCTURED RESULT</span><span className={`summary-state tone-${step.tone}`}>{step.state}</span></div><p>{step.message}</p><small>{step.detail}</small></div>
        </div>
      </div>
      <div className="workflow-controls"><button className="workflow-play" type="button" onClick={playing ? () => setPlaying(false) : play}>{playing ? 'Ⅱ 暂停演示' : active === STEPS.length - 1 ? '↻ 重播任务' : active > 0 ? '▶ 继续演示' : '▶ 播放任务演示'}</button><div className="workflow-progress" aria-label={`演示进度 ${active + 1} / ${STEPS.length}`}>{STEPS.map((item, index) => <button key={item.id} type="button" aria-label={`跳到第 ${index + 1} 步`} aria-current={index === active ? 'step' : undefined} className={`${index === active ? 'is-active' : ''} ${index <= active ? 'is-visited' : ''}`} onClick={() => { setPlaying(false); setActive(index) }} />)}</div><span className="workflow-step-count">{String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span></div>
    </div>
  )
}
