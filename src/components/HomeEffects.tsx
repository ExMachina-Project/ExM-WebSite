'use client'

import { useEffect } from 'react'

export default function HomeEffects() {
  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>('#main-content [data-reveal]')]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target instanceof HTMLElement) entry.target.dataset.revealState = 'visible'
        observer.unobserve(entry.target)
      })
    }, { threshold: .08, rootMargin: '0px 0px 30px 0px' })

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return
      element.dataset.revealState = 'waiting'
      observer.observe(element)
    })
    const showAll = () => {
      if (!motion.matches) return
      observer.disconnect()
      elements.forEach((element) => { element.dataset.revealState = 'visible' })
    }
    motion.addEventListener('change', showAll)

    return () => {
      observer.disconnect()
      motion.removeEventListener('change', showAll)
      elements.forEach((element) => { delete element.dataset.revealState })
    }
  }, [])

  return null
}
