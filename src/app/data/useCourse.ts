import { useCallback, useEffect, useState } from 'react'
import type { Course } from '../model/course'
import type { CourseRepository } from './CourseRepository'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; course: Course }
  | { status: 'error'; error: unknown }

export const useCourse = (repository: CourseRepository) => {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    let ignore = false
    repository
      .load()
      .then((course) => {
        if (!ignore) setLoadState({ status: 'ready', course })
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
      if (loadState.status !== 'ready') return
      const course = update(loadState.course)
      setLoadState({ status: 'ready', course })
      setSaveStatus('saving')
      repository
        .save(course)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'))
    },
    [loadState, repository],
  )

  return { loadState, saveStatus, updateCourse }
}
