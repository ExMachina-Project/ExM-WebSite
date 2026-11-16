'use client'

import { useEffect, useState } from 'react'
import type { DocHeading } from '../types/docs'

interface DocsTocProps {
  headings: readonly DocHeading[]
}

export default function DocsToc({ headings }: DocsTocProps) {
  const [active, setActive] = useState(headings[0]?.id || '')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      const first = visible[0]
      if (first) setActive(first.target.id)
    }, { rootMargin: '-85px 0px -65% 0px' })
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  return (
    <aside className="docs-toc"><nav aria-label="本页目录"><span>本页内容</span>{headings.filter((item) => item.level <= 3).map((item) => <a key={item.id} href={`#${item.id}`} className={item.level === 3 ? 'toc-nested' : undefined} aria-current={active === item.id ? 'location' : undefined} onClick={() => setActive(item.id)}>{item.title}</a>)}<a className="toc-top" href="#main-content">回到顶部 ↑</a></nav></aside>
  )
}
