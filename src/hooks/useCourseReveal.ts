import { useEffect, useRef, useState } from 'react'
import {
  loaderAppearDelayMs,
  loaderMinimumMs,
} from '../app/components/BlueberryLoader/loaderTiming'
import type { Course } from '../model/course'
import { preloadCourseAssets } from '../utils/preloadCourseAssets'
import { simulatePrefetch } from '../utils/simulatePrefetch'

export const useCourseReveal = (course: Course | null) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false)
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  useEffect(() => {
    if (!course || isRevealed || isLoaderLeaving) return
    let isCancelled = false
    let frame = 0
    let timer = 0
    void Promise.all([preloadCourseAssets(course), simulatePrefetch()]).then(
      () => {
        const elapsed = performance.now() - mountedAt.current
        const wasLoaderShown = elapsed >= loaderAppearDelayMs
        const hold = wasLoaderShown ? Math.max(0, loaderMinimumMs - elapsed) : 0
        timer = window.setTimeout(() => {
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
              if (isCancelled) return
              if (wasLoaderShown) setIsLoaderLeaving(true)
              else setIsRevealed(true)
            })
          })
        }, hold)
      },
    )
    return () => {
      isCancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [course, isRevealed, isLoaderLeaving])

  const finishLeaving = () => {
    setIsLoaderLeaving(false)
    setIsRevealed(true)
  }

  return { isRevealed, isLoaderLeaving, finishLeaving }
}
