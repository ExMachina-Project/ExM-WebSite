'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { DOCUMENTATION } from '../data/documentation'
import type { DocSlug } from '../data/documentation'

interface SearchEntry {
  title: string
  description: string
  group: string
  keywords?: string
  href: Route<`/docs/${DocSlug}`>
}

const ENTRIES: readonly SearchEntry[] = [
  ...DOCUMENTATION.map((doc): SearchEntry => ({ title: doc.title, description: doc.description, group: doc.group, keywords: doc.tags.join(' '), href: `/docs/${doc.slug}` })),
  { title: '文档中心', description: '全文搜索、阅读路径与全部文档。', group: '探索', href: '/docs' },
  { title: '插件市场', description: '了解插件生态与本地扩展方式。', group: '即将开放', href: '/plugins' },
]

export default function SiteSearch() {
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const normalized = query.trim().toLocaleLowerCase()
  const results = ENTRIES.filter((entry) => `${entry.title} ${entry.description} ${entry.group} ${entry.keywords || ''}`.toLocaleLowerCase().includes(normalized))

  const open = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    const focused = document.activeElement
    returnFocusRef.current = focused instanceof HTMLElement && focused !== document.body ? focused : triggerRef.current
    setQuery('')
    dialog.showModal()
    inputRef.current?.focus()
  }, [])
  const close = useCallback(() => dialogRef.current?.close(), [])

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return
      if (!event.repeat && event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        if (dialog.open) close()
        else open()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [open, close])

  const navigateResults = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
    const links = [...(resultsRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
    if (!links.length) return
    event.preventDefault()
    const index = links.findIndex((link) => link === document.activeElement)
    const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : links.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
    links[next]?.focus()
  }

  return (
    <>
      <button ref={triggerRef} className="nav-search" type="button" aria-label="搜索站内文档（Ctrl 或 Command + K）" onClick={open}><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><kbd>⌘ K</kbd></button>
      <dialog className="site-search-dialog" ref={dialogRef} aria-labelledby="site-search-title" onClose={() => returnFocusRef.current?.focus({ preventScroll: true })} onClick={(event) => { if (event.target === event.currentTarget) close() }} onKeyDown={navigateResults}>
        <h2 className="sr-only" id="site-search-title">搜索文档与页面</h2>
        <div className="site-search-input"><span aria-hidden="true">⌕</span><input ref={inputRef} aria-label="搜索文档标题和简介" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档、架构、插件…" autoComplete="off" /><button type="button" onClick={close} aria-label="关闭搜索">ESC</button></div>
        <div className="site-search-results" ref={resultsRef}><div className="site-search-caption" aria-live="polite">{normalized ? `${results.length} 个匹配结果` : '从这里开始探索'}</div>{results.length ? <ul>{results.map((entry) => <li key={entry.href}><Link href={entry.href} onClick={close}><span className="site-search-symbol" aria-hidden="true">↗</span><div><strong>{entry.title}</strong><p>{entry.description}</p></div><span className="site-search-group">{entry.group}</span></Link></li>)}</ul> : <p className="site-search-empty">没有匹配的页面，试试「安装」「编队」或「插件」。</p>}</div>
        <div className="site-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> 选择　<kbd>↵</kbd> 打开</span><Link href="/docs" onClick={close}>在文档中心搜索全文 ↗</Link></div>
      </dialog>
    </>
  )
}
