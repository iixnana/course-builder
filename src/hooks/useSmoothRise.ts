import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from './usePrefersReducedMotion'

const follow = 0.2
const settled = 0.5

export const useSmoothRise = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return
    let shown = element.getBoundingClientRect().top + scrollY
    let offset = 0
    let frame = 0
    let lastScroll = scrollY

    const layoutTop = () =>
      element.getBoundingClientRect().top + scrollY - offset

    const tick = () => {
      frame = 0
      const target = layoutTop()
      const isScrolling = scrollY !== lastScroll
      lastScroll = scrollY
      if (target >= shown || isScrolling) {
        shown = target
        offset = 0
      } else {
        shown += (target - shown) * follow
        offset = shown - target < settled ? 0 : shown - target
        if (offset === 0) shown = target
      }
      element.style.translate = offset ? `0 ${offset}px` : ''
      if (offset) frame = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    if (element.previousElementSibling) {
      observer.observe(element.previousElementSibling)
    }

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      element.style.translate = ''
    }
  }, [ref])
}
