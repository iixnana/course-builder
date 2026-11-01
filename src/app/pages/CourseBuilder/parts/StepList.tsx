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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { stepIssues, stepSummary, type Step } from '../../../model/course'
import { motion } from '../../../utils/presence'
import { DragHandle } from './DragHandle'
import { DragSwingOverlay, type DropRect } from './DragSwingOverlay'
import { ExitingStep } from './ExitingStep'
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

interface ExitingItem {
  step: Step
  index: number
}

type ListItem =
  { kind: 'step'; step: Step } | { kind: 'exiting'; item: ExitingItem }

const isReordered = (before: Step[], after: Step[]) => {
  const ids = new Set(after.map((step) => step.id))
  const kept = before.filter((step) => ids.has(step.id))
  const keptIds = new Set(kept.map((step) => step.id))
  const reordered = after.filter((step) => keptIds.has(step.id))
  return kept.some((step, index) => step.id !== reordered[index].id)
}

const readStepOffsets = () => {
  const list = document.querySelector<HTMLElement>('.step-list')
  const offsets = new Map<string, number>()
  if (!list) return offsets
  for (const item of list.querySelectorAll<HTMLElement>('[data-step-id]')) {
    offsets.set(item.dataset.stepId ?? '', item.offsetTop - list.offsetTop)
  }
  return offsets
}

const withExiting = (steps: Step[], exiting: ExitingItem[]): ListItem[] => {
  const items: ListItem[] = steps.map((step) => ({ kind: 'step', step }))
  for (const item of exiting.toSorted((a, b) => a.index - b.index)) {
    items.splice(Math.min(item.index, items.length), 0, {
      kind: 'exiting',
      item,
    })
  }
  return items
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
  const isMounted = useRef(false)
  const isListMounted = useCallback(() => isMounted.current, [])
  const list = useRef<HTMLOListElement>(null)
  const [previousSteps, setPreviousSteps] = useState(steps)
  const [exiting, setExiting] = useState<ExitingItem[]>([])
  const [flipFrom, setFlipFrom] = useState<Map<string, number> | null>(null)
  const [isDropping, setIsDropping] = useState(false)

  if (steps !== previousSteps) {
    setPreviousSteps(steps)
    const ids = new Set(steps.map((step) => step.id))
    const removed = hasMotion
      ? previousSteps.flatMap((step, index) =>
          ids.has(step.id) ? [] : [{ step, index }],
        )
      : []
    setExiting((current) => [
      ...current.filter((item) => !ids.has(item.step.id)),
      ...removed,
    ])
    if (isDropping) {
      setIsDropping(false)
    } else if (hasMotion && isReordered(previousSteps, steps)) {
      setFlipFrom(readStepOffsets())
    }
  }

  const removeExiting = useCallback((id: string) => {
    setExiting((current) => current.filter((item) => item.step.id !== id))
  }, [])

  useLayoutEffect(() => {
    const element = list.current
    if (!flipFrom || !element) return
    const timing = motion()
    for (const item of element.querySelectorAll<HTMLElement>(
      '[data-step-id]',
    )) {
      const from = flipFrom.get(item.dataset.stepId ?? '')
      if (from === undefined) continue
      const delta = from - (item.offsetTop - element.offsetTop)
      if (Math.abs(delta) < 1) continue
      item.animate(
        [{ translate: `0 ${delta}px` }, { translate: '0 0' }],
        timing,
      )
    }
  }, [flipFrom])

  useEffect(() => {
    isMounted.current = true
  }, [])

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
        dragHandle={<DragHandle tabIndex={-1} isDecorative />}
        isCollapsed={collapsedIds.has(step.id)}
        isEditing={false}
        onToggleCollapsed={ignore}
        onEdit={ignore}
        onChange={ignore}
        onTrash={ignore}
      />
    </div>
  )

  const listItems = withExiting(steps, exiting)
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
          setIsDropping(true)
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
        {listItems.length > 0 && (
          <ol
            ref={list}
            className="step-list"
            role="list"
            aria-labelledby="course-steps-title"
          >
            {listItems.map((listItem) =>
              listItem.kind === 'exiting' ? (
                <ExitingStep
                  key={listItem.item.step.id}
                  step={listItem.item.step}
                  isCollapsed={collapsedIds.has(listItem.item.step.id)}
                  onExited={removeExiting}
                />
              ) : (
                <SortableStep
                  key={listItem.step.id}
                  id={listItem.step.id}
                  isDragDisabled={editingId !== null}
                  isPlaceholder={
                    activeId === listItem.step.id ||
                    settling?.id === listItem.step.id
                  }
                  isSettling={settling?.id === listItem.step.id}
                  isInvalid={stepIssues(listItem.step).length > 0}
                  hasMotion={hasMotion}
                  isListMounted={isListMounted}
                >
                  {(dragHandle) => (
                    <StepCard
                      step={listItem.step}
                      dragHandle={dragHandle}
                      isCollapsed={collapsedIds.has(listItem.step.id)}
                      isEditing={editingId === listItem.step.id}
                      onToggleCollapsed={() =>
                        onToggleCollapsed(listItem.step.id)
                      }
                      onEdit={(isEditing) =>
                        onEdit(isEditing ? listItem.step.id : null)
                      }
                      onChange={onChangeStep}
                      onTrash={() => onTrashStep(listItem.step.id)}
                    />
                  )}
                </SortableStep>
              ),
            )}
          </ol>
        )}
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
