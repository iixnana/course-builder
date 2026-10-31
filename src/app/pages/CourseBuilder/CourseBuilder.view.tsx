import { GoldenTicket } from '../../components/GoldenTicket/GoldenTicket'
import { InlineTextField } from '../../components/InlineTextField/InlineTextField'
import { stepIssues, type Course, type StepType } from '../../model/course'
import { AddStepPanel } from './parts/AddStepPanel'
import { StepList, type StepListProps } from './parts/StepList'
import { StepToolbar } from './parts/StepToolbar'
import './CourseBuilder.css'

export interface CourseBuilderViewProps extends Omit<StepListProps, 'steps'> {
  course: Course
  undoLabel?: string
  redoLabel?: string
  isAllCollapsed: boolean
  onRenameCourse: (title: string) => void
  onAddStep: (type: StepType) => void
  onUndo: () => void
  onRedo: () => void
  onToggleAll: () => void
  onRestoreStep: (id: string) => void
  onEmptyTrash: () => void
}

export const CourseBuilderView = ({
  course,
  undoLabel,
  redoLabel,
  isAllCollapsed,
  onRenameCourse,
  onAddStep,
  onUndo,
  onRedo,
  onToggleAll,
  onRestoreStep,
  onEmptyTrash,
  ...stepListProps
}: CourseBuilderViewProps) => {
  const hasSteps = course.steps.length > 0

  return (
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

      <StepToolbar
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        stepCount={course.steps.length}
        invalidCount={
          course.steps.filter((step) => stepIssues(step).length > 0).length
        }
        isAllCollapsed={isAllCollapsed}
        trash={course.trash}
        onUndo={onUndo}
        onRedo={onRedo}
        onToggleAll={onToggleAll}
        onRestoreStep={onRestoreStep}
        onEmptyTrash={onEmptyTrash}
      />

      {hasSteps && <StepList steps={course.steps} {...stepListProps} />}

      <AddStepPanel
        message={
          hasSteps
            ? undefined
            : 'No steps yet. Pick a type to add the first one.'
        }
        onAddStep={onAddStep}
      />
    </div>
  )
}
