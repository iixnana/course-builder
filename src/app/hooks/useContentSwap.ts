import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { motion } from '../utils/presence'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export const useContentSwap = (
  ref: RefObject<HTMLElement | null>,
  trigger: unknown,
) => {
  const hasMotion = !usePrefersReducedMotion()
  const lastHeight = useRef(0)
  const lastTrigger = useRef(trigger)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const from = lastHeight.current
    const to = element.offsetHeight
    const hasChanged = !Object.is(lastTrigger.current, trigger)
    lastTrigger.current = trigger
    lastHeight.current = to
    if (!hasChanged || !hasMotion || from === 0 || to === 0 || from === to) {
      return
    }
    const { duration, easing } = motion()
    element.animate(
      [
        { height: `${from}px`, overflow: 'hidden' },
        { height: `${to}px`, overflow: 'hidden' },
      ],
      { duration, easing },
    )
    for (const child of element.firstElementChild?.children ?? []) {
      child.animate(
        [
          { opacity: 0, scale: '0.96' },
          { opacity: 1, scale: '1' },
        ],
        {
          duration: duration * 0.6,
          delay: duration * 0.4,
          easing,
          fill: 'backwards',
        },
      )
    }
  }, [ref, trigger, hasMotion])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      lastHeight.current = element.offsetHeight
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}
