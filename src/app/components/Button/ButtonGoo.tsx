import { useId } from 'react'

export const ButtonGoo = () => {
  const filterId = `button-goo-${useId()}`

  return (
    <>
      <span
        className="button-goo"
        aria-hidden="true"
        style={{ filter: `url("#${filterId}")` }}
      />
      <svg className="button-goo-filter" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
          />
        </filter>
      </svg>
    </>
  )
}
