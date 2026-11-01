import { sessionCourseRepository } from '../../../data/sessionCourseRepository'
import { CourseBuilder } from './CourseBuilder'

export const CourseBuilderPage = () => (
  <CourseBuilder repository={sessionCourseRepository} />
)
