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
    const heights = (end: number) => [
      { height: `${from}px`, overflow: 'hidden' },
      { height: `${end}px`, overflow: 'hidden' },
    ]
    const animation = element.animate(heights(to), { duration, easing })

    const content = element.firstElementChild
    if (content instanceof HTMLElement) {
      const startHeight = content.offsetHeight
      const retarget = new ResizeObserver(() => {
        if (animation.effect instanceof KeyframeEffect) {
          animation.effect.setKeyframes(
            heights(to + content.offsetHeight - startHeight),
          )
        }
      })
      retarget.observe(content)
      const stop = () => retarget.disconnect()
      animation.addEventListener('finish', stop)
      animation.addEventListener('cancel', stop)
    }
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
