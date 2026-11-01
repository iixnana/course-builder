import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export const prefersReducedMotion = () => window.matchMedia(query).matches

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion)
