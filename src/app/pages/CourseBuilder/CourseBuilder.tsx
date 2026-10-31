import { appName } from '../../appName'
import { BlueberryLoader } from '../../components/BlueberryLoader/BlueberryLoader'
import type { CourseRepository } from '../../data/CourseRepository'
import { useCourse } from '../../data/useCourse'
import { addStep, renameCourse } from '../../model/course'
import { CourseBuilderView } from './CourseBuilder.view'

interface CourseBuilderProps {
  repository: CourseRepository
}

export const CourseBuilder = ({ repository }: CourseBuilderProps) => {
  const { loadState, updateCourse } = useCourse(repository)

  if (loadState.status === 'loading') {
    return <BlueberryLoader label={`Loading ${appName}`} />
  }
  if (loadState.status === 'error') {
    throw loadState.error
  }

  return (
    <CourseBuilderView
      course={loadState.course}
      onRenameCourse={(title) =>
        updateCourse((course) => renameCourse(course, title))
      }
      onAddStep={() => updateCourse((course) => addStep(course, 'text'))}
    />
  )
}
