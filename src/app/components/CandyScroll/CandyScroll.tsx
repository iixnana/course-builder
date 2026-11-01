import { useEffect, useRef, type ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'
import './CandyScroll.css'

interface CandyScrollProps {
  className?: string
  children: ReactNode
}

export const CandyScroll = ({ className, children }: CandyScrollProps) => {
  const area = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = area.current
    const indicator = bar.current
    if (!scroller || !indicator) return
    let frame = 0

    const update = () => {
      frame = 0
      const range = scroller.scrollHeight - scroller.clientHeight
      indicator.toggleAttribute('data-overflowing', range > 1)
      indicator.style.setProperty(
        '--scroll-progress',
        String(range > 0 ? scroller.scrollTop / range : 0),
      )
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(scroller)
    for (const child of scroller.children) observer.observe(child)
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true })
    update()

    return () => {
      observer.disconnect()
      scroller.removeEventListener('scroll', scheduleUpdate)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="candy-scroll">
      <div ref={area} className={classNames('candy-scroll-area', className)}>
        {children}
      </div>
      <div ref={bar} className="candy-scroll-bar" aria-hidden="true">
        <div className="candy-scroll-fill" />
      </div>
    </div>
  )
}
