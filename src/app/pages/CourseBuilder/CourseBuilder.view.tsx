import { useRef } from 'react'
import { GoldenTicket } from '../../components/GoldenTicket/GoldenTicket'
import { HideAway } from '../../components/HideAway/HideAway'
import { InlineTextField } from '../../components/InlineTextField/InlineTextField'
import { useGrowIn } from '../../../hooks/useGrowIn'
import type { Course, Step } from '../../../model/course'
import { AddStepPanel } from './AddStep/AddStepPanel'
import { StepList, type StepListProps } from './StepList/StepList'
import { StepToolbar } from './StepToolbar/StepToolbar'
import './CourseBuilder.css'

export interface CourseBuilderViewProps extends Omit<StepListProps, 'steps'> {
  course: Course
  isRevealed: boolean
  undoLabel?: string
  redoLabel?: string
  isAllCollapsed: boolean
  onToggleLock: (isLocked: boolean) => void
  onRenameCourse: (title: string) => void
  onAddStep: (step: Step) => void
  onUndo: () => void
  onRedo: () => void
  onToggleAll: () => void
  onRestoreStep: (id: string) => void
  onRestoreAll: () => void
  onEmptyTrash: () => void
}

export const CourseBuilderView = ({
  course,
  isRevealed,
  undoLabel,
  redoLabel,
  isAllCollapsed,
  onToggleLock,
  onRenameCourse,
  onAddStep,
  onUndo,
  onRedo,
  onToggleAll,
  onRestoreStep,
  onRestoreAll,
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
          placeholder="Name your course"
          value={course.title}
          isReadOnly={stepListProps.isLocked}
          onChange={onRenameCourse}
        />
      </GoldenTicket>

      <StepToolbar
        isDisabled={!isRevealed}
        undoLabel={undoLabel}
        redoLabel={redoLabel}
        stepCount={course.steps.length}
        isAllCollapsed={isAllCollapsed}
        isLocked={stepListProps.isLocked}
        trash={course.trash}
        onUndo={onUndo}
        onRedo={onRedo}
        onToggleAll={onToggleAll}
        onToggleLock={onToggleLock}
        onRestoreStep={onRestoreStep}
        onRestoreAll={onRestoreAll}
        onEmptyTrash={onEmptyTrash}
      />

      <h2 id="course-steps-title" className="screen-reader-only">
        Course steps
      </h2>

      <StepList steps={course.steps} {...stepListProps} />

      <HideAway
        axis="block"
        isHidden={stepListProps.isLocked}
        className="course-add-steps"
      >
        <AddStepPanel isEmpty={!hasSteps} onAddStep={onAddStep} />
      </HideAway>
      {stepListProps.isLocked && !hasSteps && (
        <p className="course-locked-note">
          Unlock editing to add your first step.
        </p>
      )}
    </div>
  )
}
