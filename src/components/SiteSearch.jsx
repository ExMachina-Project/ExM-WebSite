'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DOCUMENTATION } from '../data/documentation.js'

const ENTRIES = [
  ...DOCUMENTATION.map((doc) => ({ title: doc.title, description: doc.description, group: doc.group, keywords: doc.tags.join(' '), href: `/docs/${doc.slug}` })),
  { title: '文档中心', description: '全文搜索、阅读路径与全部文档。', group: '探索', href: '/docs' },
  { title: '插件市场', description: '了解插件生态与本地扩展方式。', group: '即将开放', href: '/plugins' },
]

export default function SiteSearch() {
  const [query, setQuery] = useState('')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const normalized = query.trim().toLocaleLowerCase()
  const results = ENTRIES.filter((entry) => `${entry.title} ${entry.description} ${entry.group} ${entry.keywords || ''}`.toLocaleLowerCase().includes(normalized))

  const open = () => {
    setQuery('')
    if (!dialogRef.current.open) dialogRef.current.showModal()
    inputRef.current?.focus()
  }
  const close = () => dialogRef.current.close()

  useEffect(() => {
    const shortcut = (event) => {
      if (!event.repeat && event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        if (dialogRef.current.open) dialogRef.current.close()
        else {
          setQuery('')
          dialogRef.current.showModal()
          inputRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  const navigateResults = (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
    const links = [...resultsRef.current.querySelectorAll('a')]
    if (!links.length) return
    event.preventDefault()
    const index = links.indexOf(document.activeElement)
    const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : links.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
    links[next].focus()
  }

  return (
    <>
      <button className="nav-search" type="button" aria-label="搜索站内文档（Ctrl 或 Command + K）" onClick={open}><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><kbd>⌘ K</kbd></button>
      <dialog className="site-search-dialog" ref={dialogRef} aria-labelledby="site-search-title" onClick={(event) => { if (event.target === event.currentTarget) close() }} onKeyDown={navigateResults}>
        <h2 className="sr-only" id="site-search-title">搜索文档与页面</h2>
        <div className="site-search-input"><span aria-hidden="true">⌕</span><input ref={inputRef} aria-label="搜索文档标题和简介" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档、架构、插件…" autoComplete="off" /><button type="button" onClick={close} aria-label="关闭搜索">ESC</button></div>
        <div className="site-search-results" ref={resultsRef}><div className="site-search-caption" aria-live="polite">{normalized ? `${results.length} 个匹配结果` : '从这里开始探索'}</div>{results.length ? <ul>{results.map((entry) => <li key={entry.href}><Link href={entry.href} onClick={close}><span className="site-search-symbol" aria-hidden="true">↗</span><div><strong>{entry.title}</strong><p>{entry.description}</p></div><span className="site-search-group">{entry.group}</span></Link></li>)}</ul> : <p className="site-search-empty">没有匹配的页面，试试「安装」「编队」或「插件」。</p>}</div>
        <div className="site-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> 选择　<kbd>↵</kbd> 打开</span><Link href="/docs" onClick={close}>在文档中心搜索全文 ↗</Link></div>
      </dialog>
    </>
  )
}
