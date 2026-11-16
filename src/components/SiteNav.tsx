'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'
import { GITHUB, sitePathname } from '../site'
import BrandMark from './BrandMark'
import SiteSearch from './SiteSearch'

interface NavLink {
  label: string
  href: Route
  soon?: boolean
}

const LINKS: readonly NavLink[] = [
  { label: '首页', href: '/' },
  { label: '文档', href: '/docs' },
  { label: '插件市场', href: '/plugins', soon: true },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = sitePathname(usePathname())

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-nav-inner">
        <Link className="site-brand" href="/" aria-label="ExMachina 首页" onClick={() => setOpen(false)}>
          <BrandMark className="site-brand-mark" />
          <span>ExMachina</span>
        </Link>
        <nav className={`site-links${open ? ' is-open' : ''}`} id="site-navigation" aria-label="主导航">
          {LINKS.map(({ label, href, soon }) => {
            const current = !href.includes('#') && (href === '/' ? pathname === '/' : pathname.startsWith(href))
            return <Link href={href} key={href} aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>{label}{soon && <span className="nav-soon">即将开放</span>}</Link>
          })}
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <Link className="nav-install" href="/docs/installation" onClick={() => setOpen(false)}>开始使用 <span aria-hidden="true">↗</span></Link>
        </nav>
        <div className="nav-tools"><SiteSearch /><button className="nav-menu-toggle" type="button" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen((value) => !value)}><span /><span /></button></div>
      </div>
    </header>
  )
}
