import type { Course } from '../model/course'
import type { CourseRepository } from './CourseRepository'
import { demoCourse } from './demoCourse'

const storageKey = 'course-builder:course:v3'
const firstLoadDelayMs = import.meta.env.DEV ? 5000 : 0

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const save = async (course: Course) => {
  sessionStorage.setItem(storageKey, JSON.stringify(course))
}

export const sessionCourseRepository: CourseRepository = {
  load: async () => {
    const stored = sessionStorage.getItem(storageKey)
    if (stored) return JSON.parse(stored) as Course

    if (firstLoadDelayMs > 0) await wait(firstLoadDelayMs)
    await save(demoCourse)
    return demoCourse
  },
  save,
}
