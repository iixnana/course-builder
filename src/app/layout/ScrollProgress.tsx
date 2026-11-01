import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

const supportsScrollTimeline = () =>
  CSS.supports('animation-timeline', 'scroll()')

export const ScrollProgress = () => {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = bar.current
    if (!element) return

    const root = document.documentElement
    const tracksProgress = !supportsScrollTimeline()
    let frame = 0

    const update = () => {
      frame = 0
      const range = root.scrollHeight - root.clientHeight
      element.toggleAttribute('data-overflowing', range > 0)
      if (tracksProgress) {
        element.style.setProperty(
          '--scroll-progress',
          String(range > 0 ? root.scrollTop / range : 0),
        )
      }
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.body)
    window.addEventListener('resize', scheduleUpdate)
    if (tracksProgress) {
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
    }
    update()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate)
    }
  }, [])

  return (
    <div ref={bar} className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" />
    </div>
  )
}
