import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useState } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { stepIssues, stepSummary, type Step } from '../../../model/course'
import { DragHandle } from './DragHandle'
import { DragSwingOverlay, type DropRect } from './DragSwingOverlay'
import { SettlingOverlay } from './SettlingOverlay'
import { SortableStep } from './SortableStep'
import { StepCard } from './StepCard'
import '../../../components/Card/Card.css'
import './StepList.css'

export interface StepListProps {
  steps: Step[]
  editingId: string | null
  collapsedIds: ReadonlySet<string>
  onMoveSteps: (
    ids: string[],
    targetId: string,
    position: 'before' | 'after',
  ) => void
  onToggleCollapsed: (id: string) => void
  onEdit: (id: string | null) => void
  onChangeStep: (step: Step) => void
  onTrashStep: (id: string) => void
}

interface Settling {
  id: string
  rect: DropRect
  rotation: number
}

const ignore = () => undefined

export const StepList = ({
  steps,
  editingId,
  collapsedIds,
  onMoveSteps,
  onToggleCollapsed,
  onEdit,
  onChangeStep,
  onTrashStep,
}: StepListProps) => {
  const hasMotion = !usePrefersReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [settling, setSettling] = useState<Settling | null>(null)
  const clearSettling = useCallback(() => setSettling(null), [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const findStep = (id: UniqueIdentifier | null | undefined) =>
    steps.find((step) => step.id === id)
  const position = (id: UniqueIdentifier) =>
    steps.findIndex((step) => step.id === id) + 1
  const nameOf = (id: UniqueIdentifier) => {
    const step = findStep(id)
    return step ? `"${stepSummary(step)}"` : 'Step'
  }

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${nameOf(active.id)}. It is at position ${position(active.id)} of ${steps.length}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${nameOf(active.id)} moved to position ${position(over.id)} of ${steps.length}.`
        : `${nameOf(active.id)} is no longer over the list.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `Dropped ${nameOf(active.id)} at position ${position(over.id)} of ${steps.length}.`
        : `Dropped ${nameOf(active.id)}.`,
    onDragCancel: ({ active }) =>
      `Cancelled. ${nameOf(active.id)} went back to position ${position(active.id)}.`,
  }

  const renderStaticCard = (step: Step) => (
    <div className="card step-card step-card-floating" inert>
      <StepCard
        step={step}
        dragHandle={<DragHandle tabIndex={-1} />}
        isCollapsed={collapsedIds.has(step.id)}
        isEditing={false}
        onToggleCollapsed={ignore}
        onEdit={ignore}
        onChange={ignore}
        onTrash={ignore}
      />
    </div>
  )

  const activeStep = findStep(activeId)
  const settlingStep = findStep(settling?.id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'To reorder a step, press Space or Enter on its drag handle, use the arrow keys to move it, then press Space or Enter to drop it. Press Escape to cancel.',
        },
      }}
      onDragStart={({ active }) => {
        setSettling(null)
        setActiveId(String(active.id))
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          onMoveSteps(
            [String(active.id)],
            String(over.id),
            position(active.id) < position(over.id) ? 'after' : 'before',
          )
        }
        setActiveId(null)
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={steps.map((step) => step.id)}
        strategy={verticalListSortingStrategy}
      >
        <ol
          className="step-list"
          role="list"
          aria-labelledby="course-steps-title"
        >
          {steps.map((step) => (
            <SortableStep
              key={step.id}
              id={step.id}
              isDragDisabled={editingId !== null}
              isPlaceholder={activeId === step.id || settling?.id === step.id}
              isSettling={settling?.id === step.id}
              isInvalid={stepIssues(step).length > 0}
              hasMotion={hasMotion}
            >
              {(dragHandle) => (
                <StepCard
                  step={step}
                  dragHandle={dragHandle}
                  isCollapsed={collapsedIds.has(step.id)}
                  isEditing={editingId === step.id}
                  onToggleCollapsed={() => onToggleCollapsed(step.id)}
                  onEdit={(isEditing) => onEdit(isEditing ? step.id : null)}
                  onChange={onChangeStep}
                  onTrash={() => onTrashStep(step.id)}
                />
              )}
            </SortableStep>
          ))}
        </ol>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeStep && (
          <DragSwingOverlay
            hasMotion={hasMotion}
            onRelease={(rect, rotation) => {
              if (hasMotion) setSettling({ id: activeStep.id, rect, rotation })
            }}
          >
            {renderStaticCard(activeStep)}
          </DragSwingOverlay>
        )}
      </DragOverlay>

      {settling && settlingStep && (
        <SettlingOverlay
          id={settling.id}
          rect={settling.rect}
          rotation={settling.rotation}
          onDone={clearSettling}
        >
          {renderStaticCard(settlingStep)}
        </SettlingOverlay>
      )}
    </DndContext>
  )
}
