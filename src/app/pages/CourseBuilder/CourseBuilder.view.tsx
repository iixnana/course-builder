import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import type { SaveStatus } from '../../data/useCourse'
import { stepSummary, stepTypeLabel, type Course } from '../../model/course'
import './CourseBuilder.css'

interface CourseBuilderViewProps {
  course: Course
  saveStatus: SaveStatus
  onAddStep: () => void
}

const saveStatusLabel: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'All changes saved',
  error: "Couldn't save your changes",
}

export const CourseBuilderView = ({
  course,
  saveStatus,
  onAddStep,
}: CourseBuilderViewProps) => (
  <article className="course-builder" aria-labelledby="course-builder-title">
    <Card as="header">
      <h2 id="course-builder-title">{course.title}</h2>
      <p>{course.description}</p>
      <p role="status" className="save-status">
        {saveStatusLabel[saveStatus]}
      </p>
    </Card>

    <ol className="step-list" role="list" aria-label="Course steps">
      {course.steps.map((step) => (
        <Card as="li" key={step.id}>
          <p className="step-type">{stepTypeLabel[step.type]}</p>
          <h3>{stepSummary(step)}</h3>
        </Card>
      ))}
    </ol>

    <Button onPress={onAddStep}>Add step</Button>
  </article>
)
