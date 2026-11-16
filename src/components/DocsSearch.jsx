'use client'

import { useId, useMemo, useState } from 'react'
import Link from 'next/link'

function normalize(text) {
  return text.normalize('NFKC').toLocaleLowerCase().trim()
}

export default function DocsSearch({ index }) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const resultsId = useId()
  const normalized = normalize(query)
  const results = useMemo(() => {
    if (!normalized) return []
    const terms = normalized.split(/\s+/)
    return index.map((entry) => {
      const title = normalize(`${entry.title} ${entry.docTitle}`)
      const haystack = normalize(`${title} ${entry.tags} ${entry.text}`)
      if (!terms.every((term) => haystack.includes(term))) return null
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 4 : 1), 0)
      const offset = Math.max(0, normalize(entry.text).indexOf(terms[0]) - 36)
      return { ...entry, score, excerpt: `${offset ? '…' : ''}${entry.text.slice(offset, offset + 150)}${entry.text.length > offset + 150 ? '…' : ''}` }
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8)
  }, [index, normalized])

  return (
    <section className="docs-search" aria-label="搜索文档">
      <label className="sr-only" htmlFor={inputId}>搜索文档标题、章节或命令</label>
      <div className="docs-search-field"><span aria-hidden="true">⌕</span><input id={inputId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setQuery('') }} placeholder="搜索文档、章节或命令…" aria-controls={resultsId} autoComplete="off" /><span className="docs-search-hint">全文检索</span></div>
      <div id={resultsId}>
        {normalized && <><p className="docs-search-count" role="status">{results.length ? `${results.length} 条相关结果` : '没有找到相关内容，试试「安装」「模型」「plugin」或「审批」。'}</p><ul className="docs-search-results">{results.map((entry) => <li key={entry.href}><Link href={entry.href}><span>{entry.docTitle} <i> / </i> {entry.title}</span><p>{entry.excerpt || '打开章节阅读完整内容。'}</p><b aria-hidden="true">↗</b></Link></li>)}</ul></>}
      </div>
    </section>
  )
}
