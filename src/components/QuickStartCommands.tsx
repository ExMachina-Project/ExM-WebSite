'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import CopyCommand from './CopyCommand'
import useInstallCommands from './useInstallCommands'
import type { InstallPlatform } from '../site'

const PLATFORMS = [
  { id: 'unix', label: 'Linux / macOS', language: 'bash', comment: '# 安装并启动你的本地智能体' },
  { id: 'windows', label: 'Windows', language: 'batch', comment: ':: 下载后运行安装程序' },
] as const

export default function QuickStartCommands() {
  const commands = useInstallCommands()
  const [platform, setPlatform] = useState<InstallPlatform>('unix')
  const active = PLATFORMS.find((item) => item.id === platform) ?? PLATFORMS[0]

  const changeTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!direction && !['Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? PLATFORMS.length - 1 : (index + direction + PLATFORMS.length) % PLATFORMS.length
    const nextPlatform = PLATFORMS[next]
    if (!nextPlatform) return
    setPlatform(nextPlatform.id)
    document.getElementById(`install-tab-${nextPlatform.id}`)?.focus()
  }

  return (
    <div className="quickstart-terminal readme-code">
      <div className="terminal-tabs"><div role="tablist" aria-label="安装平台">{PLATFORMS.map((item, index) => <button type="button" role="tab" id={`install-tab-${item.id}`} aria-controls="install-platform-panel" aria-selected={platform === item.id} tabIndex={platform === item.id ? 0 : -1} key={item.id} onKeyDown={(event) => changeTab(event, index)} onClick={() => setPlatform(item.id)}>{item.label}</button>)}</div><span className="terminal-file">{active.language}</span></div>
      <div role="tabpanel" id="install-platform-panel" aria-labelledby={`install-tab-${platform}`} tabIndex={0}>
        <pre><span className="code-comment">{active.comment}</span>{'\n\n'}<code>{commands[platform]}</code></pre>
        <div className="terminal-bottom"><span><i /> 在你的机器上开始</span><CopyCommand command={commands[platform]} className="code-copy" /></div>
      </div>
    </div>
  )
}
