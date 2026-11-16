'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'

interface CopyCommandProps {
  command: string
  className?: string
  label?: string
}

type CopyStatus = 'idle' | 'copied' | 'failed'

export default function CopyCommand({ command, className = '', label = '复制安装命令' }: CopyCommandProps) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    let success = false
    try {
      await navigator.clipboard.writeText(command)
      success = true
    } catch {
      const previousFocus = document.activeElement
      const input = document.createElement('textarea')
      input.value = command
      input.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(input)
      input.select()
      try { success = document.execCommand('copy') } catch { /* Report failure below. */ }
      input.remove()
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
    }
    setStatus(success ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 1800)
  }

  const copied = status === 'copied'
  return (
    <button type="button" className={`copy-btn ${copied ? 'is-copied' : ''} ${className}`.trim()} onClick={copy} aria-label={copied ? '已复制' : status === 'failed' ? '复制失败，请手动选择内容' : label}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{copied ? 'COPIED' : status === 'failed' ? '请手动复制' : 'COPY'}</span>
    </button>
  )
}
