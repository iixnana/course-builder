import { BlueberryLoader } from '../../components/BlueberryLoader/BlueberryLoader'
import type { CourseRepository } from '../../data/CourseRepository'
import { useCourse } from '../../data/useCourse'
import { addStep } from '../../model/course'
import { CourseBuilderView } from './CourseBuilder.view'

interface CourseBuilderProps {
  repository: CourseRepository
}

export const CourseBuilder = ({ repository }: CourseBuilderProps) => {
  const { loadState, saveStatus, updateCourse } = useCourse(repository)

  if (loadState.status === 'loading') {
    return <BlueberryLoader label="Loading Course Builder" />
  }
  if (loadState.status === 'error') {
    throw loadState.error
  }

  return (
    <CourseBuilderView
      course={loadState.course}
      saveStatus={saveStatus}
      onAddStep={() => updateCourse((course) => addStep(course, 'text'))}
    />
  )
}
