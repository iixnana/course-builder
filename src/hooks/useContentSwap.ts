import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { motion, presenceSpaceDuration } from '../utils/presence'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface ContentSwapOptions {
  isMatchingEntry?: boolean
}

const outerHeight = (element: HTMLElement) => {
  const { marginTop, marginBottom } = getComputedStyle(element)
  return (
    element.offsetHeight +
    Number.parseFloat(marginTop) +
    Number.parseFloat(marginBottom)
  )
}

export const useContentSwap = (
  ref: RefObject<HTMLElement | null>,
  trigger: unknown,
  { isMatchingEntry = false }: ContentSwapOptions = {},
) => {
  const hasMotion = !usePrefersReducedMotion()
  const lastHeight = useRef(0)
  const lastTrigger = useRef(trigger)
  const running = useRef<Animation | null>(null)

  useLayoutEffect(() => {
    const element = ref.current
    const content = element?.firstElementChild
    const hasChanged = !Object.is(lastTrigger.current, trigger)
    lastTrigger.current = trigger
    if (!element || !(content instanceof HTMLElement)) return
    if (!hasChanged || !hasMotion) {
      lastHeight.current = element.offsetHeight
      return
    }
    running.current?.cancel()
    const from = lastHeight.current
    element.style.height = `${from}px`
    const to = outerHeight(content)
    lastHeight.current = to
    if (from === 0 || to === 0 || from === to) {
      element.style.removeProperty('height')
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
    const animation = element.animate(heights(to), {
      duration,
      easing,
      fill: 'forwards',
    })
    running.current = animation

    const startHeight = content.offsetHeight
    const retarget = new ResizeObserver(() => {
      if (animation.effect instanceof KeyframeEffect) {
        animation.effect.setKeyframes(
          heights(to + content.offsetHeight - startHeight),
        )
      }
    })
    retarget.observe(content)
    const stop = () => {
      retarget.disconnect()
      if (running.current !== animation) return
      running.current = null
      element.style.removeProperty('height')
      animation.cancel()
    }
    void animation.finished.then(stop, stop)

    for (const child of content.children) {
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
}
