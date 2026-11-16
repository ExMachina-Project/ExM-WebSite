'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { DOCUMENTATION, DOCUMENTATION_GROUPS } from '../data/documentation'
import { sitePathname } from '../site'

export default function DocsSidebar() {
  const pathname = sitePathname(usePathname())
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const close = () => {
    if (open) toggleRef.current?.focus({ preventScroll: true })
    setOpen(false)
  }

  return (
    <aside className={`docs-sidebar${open ? ' is-open' : ''}`}>
      <button ref={toggleRef} className="docs-menu-toggle" type="button" aria-expanded={open} aria-controls="docs-sidebar-navigation" onClick={() => setOpen((value) => !value)}>文档目录 <span aria-hidden="true">{open ? '−' : '+'}</span></button>
      <nav className="docs-side-navigation" id="docs-sidebar-navigation" aria-label="文档导航">
        <span className="docs-sidebar-caption">EXMACHINA / DOCS</span>
        <Link className="docs-overview-link" href="/docs" aria-current={pathname === '/docs' ? 'page' : undefined} onClick={close}>文档概览 <span>↗</span></Link>
        {DOCUMENTATION_GROUPS.map((group) => <div className="docs-nav-group" key={group}><span>{group}</span>{DOCUMENTATION.filter((doc) => doc.group === group).map((doc) => <Link href={`/docs/${doc.slug}`} key={doc.slug} aria-current={pathname === `/docs/${doc.slug}` ? 'page' : undefined} onClick={close}>{doc.title}</Link>)}</div>)}
        <Link className="docs-market-link" href="/plugins" onClick={close}>插件市场 <small>即将开放</small></Link>
      </nav>
    </aside>
  )
}
