import { useRef, type RefObject } from 'react'
import { GoldenTicket } from '../../components/GoldenTicket/GoldenTicket'
import { HideAway } from '../../components/HideAway/HideAway'
import { InlineTextField } from '../../components/InlineTextField/InlineTextField'
import { useGrowIn } from '../../../hooks/useGrowIn'
import type { Course } from '../../../model/course'
import type { Step } from '../../../model/step'
import { AddStepPanel } from './AddStep/AddStepPanel'
import { StepList, type StepListProps } from './StepList/StepList'
import './CourseBuilder.css'

interface CourseBuilderViewProps extends Omit<StepListProps, 'steps'> {
  course: Course
  isRevealed: boolean
  addStepPanelRef: RefObject<HTMLDivElement | null>
  onRenameCourse: (title: string) => void
  onAddStep: (step: Step) => void
}

export const CourseBuilderView = ({
  course,
  isRevealed,
  addStepPanelRef,
  onRenameCourse,
  onAddStep,
  ...stepListProps
}: CourseBuilderViewProps) => {
  const { isLocked } = stepListProps
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
          isReadOnly={isLocked}
          onChange={onRenameCourse}
        />
      </GoldenTicket>

      <h2 id="course-steps-title" className="screen-reader-only">
        Course steps
      </h2>

      <StepList steps={course.steps} {...stepListProps} />

      <HideAway axis="block" isHidden={isLocked} className="course-add-steps">
        <AddStepPanel
          ref={addStepPanelRef}
          isEmpty={!hasSteps}
          onAddStep={onAddStep}
        />
      </HideAway>
      {isLocked && !hasSteps && (
        <p className="course-locked-note">
          Unlock editing to add your first step.
        </p>
      )}
    </div>
  )
}
