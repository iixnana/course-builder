import { useRef } from 'react'
import { GoldenTicket } from '../../components/GoldenTicket/GoldenTicket'
import { InlineTextField } from '../../components/InlineTextField/InlineTextField'
import { useGrowIn } from '../../hooks/useGrowIn'
import { stepIssues, type Course, type StepType } from '../../model/course'
import { AddStepPanel } from './parts/AddStepPanel'
import { StepList, type StepListProps } from './parts/StepList'
import { StepToolbar } from './parts/StepToolbar'
import './CourseBuilder.css'

export interface CourseBuilderViewProps extends Omit<StepListProps, 'steps'> {
  course: Course
  isRevealed: boolean
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
  isRevealed,
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
  const root = useRef<HTMLDivElement>(null)
  useGrowIn(root, isRevealed)

  return (
    <div
      ref={root}
      className="course-builder"
      data-revealed={isRevealed || undefined}
    >
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

      <StepList steps={course.steps} {...stepListProps} />

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
