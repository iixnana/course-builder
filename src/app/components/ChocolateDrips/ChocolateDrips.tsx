import type { CSSProperties } from 'react'
import './ChocolateDrips.css'

const filterId = 'chocolate-drips-goo'

const spread = (index: number, step: number) => (index * step) % 1

const drips = Array.from({ length: 40 }, (_, index) => {
  const time = 2.25 + spread(index, 0.236068) * 1.75
  return {
    '--position': `${-5 + spread(index, 0.618034) * 110}%`,
    '--size': `${1.25 + spread(index, 0.414214) * 1.75}rem`,
    '--distance': `${3 + spread(index, 0.732051) * 3}rem`,
    '--time': `${time}s`,
    '--delay': `${-time * spread(index, 0.316625)}s`,
  } as CSSProperties
})

export const ChocolateDrips = () => (
  <div className="chocolate-drips" aria-hidden="true">
    <div
      className="chocolate-drips-goo"
      style={{ filter: `url(#${filterId})` }}
    >
      {drips.map((style, index) => (
        <span key={index} className="chocolate-drip" style={style} />
      ))}
    </div>
    <svg className="chocolate-drips-filter" focusable="false">
      <filter id={filterId}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
        />
      </filter>
    </svg>
  </div>
)
