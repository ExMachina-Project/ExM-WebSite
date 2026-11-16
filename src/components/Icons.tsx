import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.5,
  strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="9" y="9" width="11" height="11" /><path d="M5.5 15.5V4.5h11" /></svg>
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 12.5 9.5 18 20 6.5" /></svg>
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M6 18 18 6M9 6h9v9" /></svg>
}
