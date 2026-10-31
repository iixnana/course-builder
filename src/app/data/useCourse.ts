import { useCallback, useEffect, useRef, useState } from 'react'
import type { Course } from '../model/course'
import type { CourseRepository } from './CourseRepository'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; course: Course }
  | { status: 'error'; error: unknown }

export const useCourse = (repository: CourseRepository) => {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const latestCourse = useRef<Course | null>(null)

  useEffect(() => {
    let ignore = false
    repository
      .load()
      .then((course) => {
        if (ignore) return
        latestCourse.current = course
        setLoadState({ status: 'ready', course })
      })
      .catch((error: unknown) => {
        if (!ignore) setLoadState({ status: 'error', error })
      })
    return () => {
      ignore = true
    }
  }, [repository])

  const updateCourse = useCallback(
    (update: (course: Course) => Course) => {
      if (!latestCourse.current) return
      const course = update(latestCourse.current)
      latestCourse.current = course
      setLoadState({ status: 'ready', course })
      repository.save(course).catch((error: unknown) => {
        console.error("Couldn't save the course", error)
      })
    },
    [repository],
  )

  return { loadState, updateCourse }
}
