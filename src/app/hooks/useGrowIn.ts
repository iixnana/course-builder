import { useLayoutEffect, type RefObject } from 'react'
import { motion } from '../utils/presence'
import { prefersReducedMotion } from './usePrefersReducedMotion'

const growEasing = 'cubic-bezier(0.2, 0, 0, 1)'

export const useGrowIn = (
  ref: RefObject<HTMLElement | null>,
  isShown: boolean,
) => {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || !isShown || prefersReducedMotion()) return
    const { duration, easing } = motion()
    element.animate(
      [
        { height: '0px', overflow: 'clip' },
        { height: `${element.offsetHeight}px`, overflow: 'clip' },
      ],
      { duration: duration * 2, easing: growEasing },
    )
    element.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing })
  }, [ref, isShown])
}
