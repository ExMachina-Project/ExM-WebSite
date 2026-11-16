const SHAPES = {
  swarm: <><path d="M32 16v12M18 45l10-10m8 0 10 10M14 48h36" /><circle cx="32" cy="10" r="5" /><circle cx="32" cy="32" r="5" /><circle cx="12" cy="48" r="5" /><circle cx="52" cy="48" r="5" /></>,
  agent: <><circle cx="32" cy="28" r="12" /><circle cx="32" cy="28" r="4" /><path d="M12 28a20 20 0 0 1 40 0M18 47h28M24 53h16" /></>,
  memory: <><path d="m8 23 24-12 24 12-24 12L8 23Zm0 10 24 12 24-12M8 43l24 12 24-12" /><path d="M32 35v20" /></>,
  tools: <><path d="m32 8 21 9v15c0 11-10 18-21 24-11-6-21-13-21-24V17l21-9Z" /><path d="m23 32 6 6 13-14" /></>,
  connect: <><path d="m24 20 8-8 12 12-8 8M20 24l-8 8 12 12 8-8M19 45l-8 8M45 19l8-8M25 39l14-14" /></>,
  local: <><rect x="10" y="12" width="44" height="32" rx="2" /><path d="M24 53h16M32 44v9M20 24l6 5-6 5M32 34h10" /></>,
}

interface SystemGlyphProps {
  type: keyof typeof SHAPES
  className?: string
}

export default function SystemGlyph({ type, className = '' }: SystemGlyphProps) {
  return <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SHAPES[type]}</svg>
}
