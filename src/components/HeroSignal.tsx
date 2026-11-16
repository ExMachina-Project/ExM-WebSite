'use client'

import { useEffect, useRef, useState } from 'react'
import BrandMark from './BrandMark'

type SignalMode = 'single' | 'collective'

interface Point3D {
  x: number
  y: number
  z: number
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const PARTICLES = Array.from({ length: 340 }, (_, index) => {
  const y = 1 - (index / 339) * 2
  const radius = Math.sqrt(1 - y * y)
  return { x: Math.cos(index * GOLDEN_ANGLE) * radius, y, z: Math.sin(index * GOLDEN_ANGLE) * radius }
})

export default function HeroSignal() {
  const [mode, setMode] = useState<SignalMode>('collective')
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetMode = useRef(1)
  const renderRef = useRef<(() => void) | null>(null)
  const pausedRef = useRef(false)
  const syncRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const context = canvas.getContext('2d')
    if (!context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frame = 0
    let lastTime = 0
    let clock = 0
    let formation = targetMode.current
    let inView = true
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const draw = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 32
      lastTime = time
      if (!reducedMotion.matches) clock += elapsed
      formation = reducedMotion.matches || pausedRef.current ? targetMode.current : formation + (targetMode.current - formation) * .065
      pointer.x += (pointer.targetX - pointer.x) * .06
      pointer.y += (pointer.targetY - pointer.y) * .06

      context.clearRect(0, 0, width, height)
      const radius = Math.min(width * .37, height * .37)
      const centerX = width / 2
      const centerY = height * .48
      const turn = clock * .000075 + .35 + pointer.x * .16
      const tilt = -.28 + pointer.y * .14
      const spread = .64 + formation * .36
      const project = (point: Point3D) => {
        const x = point.x * Math.cos(turn) + point.z * Math.sin(turn)
        const depth = -point.x * Math.sin(turn) + point.z * Math.cos(turn)
        const y = point.y * Math.cos(tilt) - depth * Math.sin(tilt)
        const z = point.y * Math.sin(tilt) + depth * Math.cos(tilt)
        const perspective = 3.5 / (3.5 - z)
        return { x: centerX + x * radius * spread * perspective, y: centerY + y * radius * spread * perspective, z, perspective }
      }

      const glow = context.createRadialGradient(centerX, centerY, 12, centerX, centerY, radius * 1.45)
      glow.addColorStop(0, 'rgba(148, 113, 255, .17)')
      glow.addColorStop(.55, 'rgba(117, 81, 239, .06)')
      glow.addColorStop(1, 'rgba(117, 81, 239, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      context.lineWidth = .65
      context.strokeStyle = 'rgba(169, 154, 220, .13)'
      for (let latitude = -2; latitude <= 2; latitude++) {
        const y = latitude * .32
        const ringRadius = Math.sqrt(1 - y * y)
        context.beginPath()
        for (let step = 0; step <= 72; step++) {
          const angle = step / 72 * Math.PI * 2
          const point = project({ x: Math.cos(angle) * ringRadius, y, z: Math.sin(angle) * ringRadius })
          if (!step) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }
      for (let longitude = 0; longitude < 8; longitude++) {
        const angle = longitude / 8 * Math.PI
        context.beginPath()
        for (let step = 0; step <= 72; step++) {
          const arc = step / 72 * Math.PI * 2
          const point = project({ x: Math.cos(arc) * Math.cos(angle), y: Math.sin(arc), z: Math.cos(arc) * Math.sin(angle) })
          if (!step) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }

      for (const [index, particle] of PARTICLES.entries()) {
        const point = project(particle)
        const alpha = .16 + (point.z + 1) * .29
        context.fillStyle = index % 7 === 0 ? `rgba(189, 164, 255, ${alpha})` : `rgba(218, 215, 237, ${alpha * .7})`
        context.beginPath()
        context.arc(point.x, point.y, (index % 7 === 0 ? 1.45 : .8) * point.perspective, 0, Math.PI * 2)
        context.fill()
      }

      if (formation > .02) {
        for (let index = 0; index < 12; index++) {
          const particle = PARTICLES[index * 28 + 7]
          if (!particle) continue
          const point = project(particle)
          const middleX = (point.x + centerX) / 2 + (point.y - centerY) * .15
          const middleY = (point.y + centerY) / 2 - (point.x - centerX) * .15
          context.beginPath()
          context.moveTo(centerX, centerY)
          context.quadraticCurveTo(middleX, middleY, point.x, point.y)
          context.strokeStyle = `rgba(178, 148, 255, ${(.15 + (point.z + 1) * .1) * formation})`
          context.lineWidth = .8
          context.stroke()
          context.setLineDash([3, 82])
          context.lineDashOffset = -clock * .018 + index * 12
          context.strokeStyle = `rgba(220, 201, 255, ${.8 * formation})`
          context.stroke()
          context.setLineDash([])
          context.beginPath()
          context.arc(point.x, point.y, 3 * point.perspective, 0, Math.PI * 2)
          context.fillStyle = `rgba(204, 184, 255, ${formation * .85})`
          context.fill()
          context.beginPath()
          context.arc(point.x, point.y, 7 * point.perspective, 0, Math.PI * 2)
          context.strokeStyle = `rgba(178, 148, 255, ${formation * .25})`
          context.stroke()
        }
      }
    }

    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      if (time - lastTime >= 32) draw(time)
    }
    const syncAnimation = () => {
      cancelAnimationFrame(frame)
      lastTime = 0
      const playing = inView && !document.hidden && !reducedMotion.matches && !pausedRef.current
      container.dataset.animation = playing ? 'running' : 'paused'
      draw(performance.now())
      if (playing) frame = requestAnimationFrame(animate)
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(performance.now())
    }
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion.matches) return
      const rect = container.getBoundingClientRect()
      pointer.targetX = (event.clientX - rect.left) / rect.width * 2 - 1
      pointer.targetY = (event.clientY - rect.top) / rect.height * 2 - 1
    }
    const resetPointer = () => { pointer.targetX = 0; pointer.targetY = 0 }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return
      inView = entry.isIntersecting
      syncAnimation()
    })
    intersectionObserver.observe(container)
    container.addEventListener('pointermove', movePointer, { passive: true })
    container.addEventListener('pointerleave', resetPointer)
    document.addEventListener('visibilitychange', syncAnimation)
    reducedMotion.addEventListener('change', syncAnimation)
    renderRef.current = () => { if (reducedMotion.matches) draw(performance.now()) }
    syncRef.current = syncAnimation
    resize()
    syncAnimation()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      container.removeEventListener('pointermove', movePointer)
      container.removeEventListener('pointerleave', resetPointer)
      document.removeEventListener('visibilitychange', syncAnimation)
      reducedMotion.removeEventListener('change', syncAnimation)
      renderRef.current = null
      syncRef.current = null
    }
  }, [])

  const selectMode = (next: SignalMode) => {
    targetMode.current = next === 'collective' ? 1 : 0
    setMode(next)
    if (pausedRef.current) syncRef.current?.()
    else renderRef.current?.()
  }

  const toggleMotion = () => {
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
    syncRef.current?.()
  }

  return (
    <figure className={`intelligence-field is-${mode}`} ref={containerRef} aria-label="单体与编队协作的交互式概念演示">
      <div className="field-coordinate field-coordinate--top"><span>EXM / INTELLIGENCE FIELD</span><div><span>01 — ∞</span><button className="field-pause" type="button" onClick={toggleMotion} aria-pressed={paused} aria-label={paused ? '播放粒子场动效' : '暂停粒子场动效'}><svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">{paused ? <path d="m3 1 8 5-8 5V1Z" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" />}</svg></button></div></div>
      <div className="field-scene">
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="field-orbit field-orbit--outer" aria-hidden="true" />
        <div className="field-orbit field-orbit--inner" aria-hidden="true" />
        <div className="field-crosshair" aria-hidden="true" />
        <div className="field-core" aria-hidden="true"><span className="field-core-ring" /><BrandMark /></div>
        <span className="field-label field-label--one" aria-hidden="true"><i /> PLANNER</span>
        <span className="field-label field-label--two" aria-hidden="true"><i /> EXECUTOR</span>
        <span className="field-label field-label--three" aria-hidden="true"><i /> EVIDENCE</span>
        <span className="field-label field-label--four" aria-hidden="true"><i /> VALIDATOR</span>
        <span className="field-axis" aria-hidden="true">X / Y / Z</span>
      </div>
      <figcaption className="field-toolbar">
        <div className="field-mode-switch" role="group" aria-label="切换智能体演示模式">
          <button type="button" aria-pressed={mode === 'single'} onClick={() => selectMode('single')}>单体</button>
          <button type="button" aria-pressed={mode === 'collective'} onClick={() => selectMode('collective')}>编队</button>
        </div>
        <span className="field-demo-label">交互演示</span>
        <span className="sr-only" aria-live="polite">{mode === 'collective' ? '多体协作，沿契约连接。' : '独立执行，专注当前任务。'}</span>
      </figcaption>
    </figure>
  )
}
