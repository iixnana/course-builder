import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { GoldenTicket } from '../../components/GoldenTicket/GoldenTicket'
import { InlineTextField } from '../../components/InlineTextField/InlineTextField'
import { stepSummary, stepTypeLabel, type Course } from '../../model/course'
import './CourseBuilder.css'

interface CourseBuilderViewProps {
  course: Course
  onRenameCourse: (title: string) => void
  onAddStep: () => void
}

export const CourseBuilderView = ({
  course,
  onRenameCourse,
  onAddStep,
}: CourseBuilderViewProps) => (
  <div className="course-builder">
    <GoldenTicket className="course-details">
      <InlineTextField
        label="Course name"
        isWrapping
        placeholder="Untitled course"
        value={course.title}
        onChange={onRenameCourse}
      />
    </GoldenTicket>

    <h2 id="course-steps-title" className="screen-reader-only">
      Steps
    </h2>
    <ol className="step-list" role="list" aria-labelledby="course-steps-title">
      {course.steps.map((step) => (
        <Card as="li" key={step.id}>
          <p className="eyebrow">{stepTypeLabel[step.type]}</p>
          <h3>{stepSummary(step)}</h3>
        </Card>
      ))}
    </ol>

    <Button onPress={onAddStep}>Add step</Button>
  </div>
)
