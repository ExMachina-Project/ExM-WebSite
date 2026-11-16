import type { CSSVariables } from '../types/styles'

const LINES = [
  { top: '5%', left: '-4%', width: '44%', delay: '0s' },
  { top: '42%', left: '52%', width: '38%', delay: '1.4s' },
  { top: '73%', left: '5%', width: '32%', delay: '2.8s' },
  { top: '88%', left: '65%', width: '29%', delay: '.7s' },
]

export default function DataFlowBackground() {
  return (
    <div className="data-flow-background" aria-hidden="true">
      {LINES.map(({ delay, ...position }, index) => {
        const style: CSSVariables = { ...position, '--delay': delay }
        return <i className="data-flow-line" key={index} style={style} />
      })}
    </div>
  )
}
