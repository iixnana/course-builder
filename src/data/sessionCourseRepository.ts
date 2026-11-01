import type { Course } from '../model/course'
import type { CourseRepository } from './CourseRepository'
import { demoCourse } from './demoCourse'

const storageKey = 'course-builder:course:v12'
const save = async (course: Course) => {
  sessionStorage.setItem(storageKey, JSON.stringify(course))
}

export const sessionCourseRepository: CourseRepository = {
  load: async () => {
    const stored = sessionStorage.getItem(storageKey)
    if (stored) return JSON.parse(stored) as Course

    await save(demoCourse)
    return demoCourse
  },
  save,
}
