import { useEffect, useState, type ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'
import './HideAway.css'

interface HideAwayProps {
  isHidden: boolean
  axis: 'inline' | 'block'
  className?: string
  children: ReactNode
}

export const HideAway = ({
  isHidden,
  axis,
  className,
  children,
}: HideAwayProps) => {
  const [isSettled, setIsSettled] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsSettled(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={classNames('hide-away', className)}
      data-axis={axis}
      data-hidden={isHidden || undefined}
      data-settled={isSettled || undefined}
      inert={isHidden}
    >
      <div className="hide-away-inner">{children}</div>
    </div>
  )
}
