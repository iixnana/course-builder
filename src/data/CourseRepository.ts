import type { Course } from '../model/course'

export interface CourseRepository {
  load: () => Promise<Course>
  save: (course: Course) => Promise<void>
}
