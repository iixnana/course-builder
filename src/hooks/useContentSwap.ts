import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { motion, presenceSpaceDuration } from '../utils/presence'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface ContentSwapOptions {
  isMatchingEntry?: boolean
}

export const useContentSwap = (
  ref: RefObject<HTMLElement | null>,
  trigger: unknown,
  { isMatchingEntry = false }: ContentSwapOptions = {},
) => {
  const hasMotion = !usePrefersReducedMotion()
  const lastHeight = useRef(0)
  const lastTrigger = useRef(trigger)
  const lastScroll = useRef(0)

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
    const { easing } = motion()
    const duration = isMatchingEntry
      ? presenceSpaceDuration()
      : motion().duration
    const heights = (end: number) => [
      { height: `${from}px`, overflow: 'hidden' },
      { height: `${end}px`, overflow: 'hidden' },
    ]
    const root = document.documentElement
    const isClamped =
      window.scrollY < lastScroll.current &&
      window.scrollY >= root.scrollHeight - window.innerHeight - 1
    if (isClamped) {
      element.style.height = `${from}px`
      window.scrollTo(0, lastScroll.current)
      element.style.removeProperty('height')
    }
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
  }, [ref, trigger, hasMotion, isMatchingEntry])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      lastHeight.current = element.offsetHeight
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    const track = () => {
      lastScroll.current = window.scrollY
    }
    track()
    window.addEventListener('scroll', track, { passive: true })
    return () => window.removeEventListener('scroll', track)
  }, [])
}
