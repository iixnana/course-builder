import { useCallback, useEffect, useRef, useState } from 'react'
import type { Course } from '../model/course'
import {
  commit,
  createHistory,
  forget,
  redo,
  undo,
  type History,
} from './history'
import type { CourseRepository } from '../data/CourseRepository'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; history: History<Course> }
  | { status: 'error'; error: unknown }

interface UpdateOptions {
  mergeKey?: string
  isPermanent?: boolean
}

export const useCourseHistory = (repository: CourseRepository) => {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const latest = useRef<History<Course> | null>(null)

  useEffect(() => {
    let ignore = false
    repository
      .load()
      .then((course) => {
        if (ignore) return
        latest.current = createHistory(course)
        setLoadState({ status: 'ready', history: latest.current })
      })
      .catch((error: unknown) => {
        if (!ignore) setLoadState({ status: 'error', error })
      })
    return () => {
      ignore = true
    }
  }, [repository])

  const apply = useCallback(
    (change: (history: History<Course>) => History<Course>) => {
      if (!latest.current) return
      const history = change(latest.current)
      if (history === latest.current) return
      latest.current = history
      setLoadState({ status: 'ready', history })
      repository.save(history.present.state).catch((error: unknown) => {
        console.error("Couldn't save the course", error)
      })
    },
    [repository],
  )

  const updateCourse = useCallback(
    (
      update: (course: Course) => Course,
      { mergeKey, isPermanent = false }: UpdateOptions = {},
    ) =>
      apply((history) => {
        const next = commit(history, update(history.present.state), mergeKey)
        return isPermanent ? forget(next) : next
      }),
    [apply],
  )

  const undoChange = useCallback(() => apply(undo), [apply])
  const redoChange = useCallback(() => apply(redo), [apply])

  return { loadState, updateCourse, undoChange, redoChange }
}
