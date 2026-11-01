import { useLayoutEffect, type RefObject } from 'react'
import { motion } from '../utils/presence'
import { prefersReducedMotion } from './usePrefersReducedMotion'

export const useGrowIn = (
  ref: RefObject<HTMLElement | null>,
  isShown: boolean,
) => {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || !isShown || prefersReducedMotion()) return
    const { duration, easing } = motion()

    const onScreen = window.innerHeight - element.getBoundingClientRect().top
    const end = Math.min(element.offsetHeight, Math.max(0, onScreen))

    element.animate(
      [
        { height: '0px', overflow: 'clip' },
        { height: `${end}px`, overflow: 'clip' },
      ],
      { duration: duration * 2, easing },
    )
    element.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing })
  }, [ref, isShown])
}
