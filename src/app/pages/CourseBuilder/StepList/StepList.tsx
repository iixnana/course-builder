import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { usePrefersReducedMotion } from '../../../../hooks/usePrefersReducedMotion'
import type { Step } from '../../../../model/step'
import { keepInView } from '../../../../utils/keepInView'
import { inertStepCardHandlers } from '../StepCard/inertStepCardHandlers'
import { StepCard } from '../StepCard/StepCard'
import {
  dragAnnouncements,
  dragInstructions,
  edgeAnnouncement,
  moveAnnouncement,
} from './dragAnnouncements'
import { DragHandle, type MoveDirection } from './DragHandle'
import { DragSwingOverlay, type DropRect } from './DragSwingOverlay'
import { ExitingStep } from './ExitingStep'
import { SettlingOverlay } from './SettlingOverlay'
import { SortableStep } from './SortableStep'
import { useExitingSteps, type ExitingItem } from './useExitingSteps'
import { useReorderFlip } from './useReorderFlip'
import '../../../components/Card/Card.css'
import './StepList.css'

export interface StepListProps {
  ref?: RefObject<HTMLOListElement | null>
  steps: Step[]
  editingId: string | null
  isLocked: boolean
  swiftCloseId: string | null
  collapsedIds: ReadonlySet<string>
  onMoveSteps: (
    ids: string[],
    targetId: string,
    position: 'before' | 'after',
  ) => void
  onToggleCollapsed: (id: string) => void
  onEdit: (id: string | null) => void
  onDiscardEdit: (id: string) => void
  onChangeStep: (step: Step) => void
  onTrashStep: (id: string) => void
}

type ListItem =
  { kind: 'step'; step: Step } | { kind: 'exiting'; item: ExitingItem }

interface Settling {
  id: string
  target: Element
  rect: DropRect
  rotation: number
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

export const StepList = ({
  ref,
  steps,
  editingId,
  isLocked,
  swiftCloseId,
  collapsedIds,
  onMoveSteps,
  onToggleCollapsed,
  onEdit,
  onDiscardEdit,
  onChangeStep,
  onTrashStep,
}: StepListProps) => {
  const hasMotion = !usePrefersReducedMotion()
  const [list, setList] = useState<HTMLOListElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [settling, setSettling] = useState<Settling | null>(null)
  const clearSettling = useCallback(() => setSettling(null), [])
  const isMounted = useRef(false)
  const isListMounted = useCallback(() => isMounted.current, [])
  const stepNodes = useRef(new Map<string, HTMLLIElement>())
  const [announcement, setAnnouncement] = useState('')
  const refocusId = useRef<string | null>(null)
  const { exiting, removeExiting } = useExitingSteps(
    steps,
    editingId,
    hasMotion,
  )
  const skipNextFlip = useReorderFlip(steps, list, hasMotion)

  useEffect(() => {
    isMounted.current = true
  }, [])

  const attachList = (node: HTMLOListElement | null) => {
    setList(node)
    if (ref) ref.current = node
  }

  const trackNode = useCallback((id: string, node: HTMLLIElement | null) => {
    if (node) stepNodes.current.set(id, node)
    else stepNodes.current.delete(id)
  }, [])

  useLayoutEffect(() => {
    const id = refocusId.current
    if (!id) return
    refocusId.current = null
    stepNodes.current
      .get(id)
      ?.querySelector<HTMLElement>('.step-drag-handle')
      ?.focus({ preventScroll: true })
  }, [steps])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const findStep = (id: string | null | undefined) =>
    steps.find((step) => step.id === id)
  const position = (id: string) => steps.findIndex((step) => step.id === id)

  const moveByKeyboard = (id: string, direction: MoveDirection) => {
    const step = findStep(id)
    const index = position(id)
    const target = steps[index + direction]
    if (!step) return
    if (!target) {
      setAnnouncement(edgeAnnouncement(step, direction))
      return
    }
    keepInView(stepNodes.current.get(id))
    onMoveSteps([id], target.id, direction > 0 ? 'after' : 'before')
    setAnnouncement(moveAnnouncement(step, index + direction + 1, steps.length))
    refocusId.current = id
  }

  const renderStaticCard = (step: Step) => (
    <div className="card step-card step-card-floating" inert>
      <StepCard
        step={step}
        dragHandle={<DragHandle tabIndex={-1} isDecorative />}
        isCollapsed={collapsedIds.has(step.id)}
        isEditing={false}
        {...inertStepCardHandlers}
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
        announcements: dragAnnouncements(steps),
        screenReaderInstructions: { draggable: dragInstructions },
      }}
      onDragStart={({ active }) => {
        setSettling(null)
        setActiveId(String(active.id))
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          const from = String(active.id)
          const to = String(over.id)
          skipNextFlip()
          onMoveSteps(
            [from],
            to,
            position(from) < position(to) ? 'after' : 'before',
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
          ref={attachList}
          className="step-list"
          data-empty={steps.length === 0 || undefined}
          role="list"
          aria-labelledby="course-steps-title"
        >
          {listItems.map((listItem) =>
            listItem.kind === 'exiting' ? (
              <ExitingStep
                key={listItem.item.step.id}
                step={listItem.item.step}
                isCollapsed={collapsedIds.has(listItem.item.step.id)}
                isEditing={listItem.item.wasEditing}
                onExited={removeExiting}
              />
            ) : (
              <SortableStep
                key={listItem.step.id}
                id={listItem.step.id}
                isDragDisabled={isLocked || editingId !== null}
                isPlaceholder={
                  activeId === listItem.step.id ||
                  settling?.id === listItem.step.id
                }
                hasMotion={hasMotion}
                isListMounted={isListMounted}
                onNode={trackNode}
                onMove={moveByKeyboard}
              >
                {(dragHandle) => (
                  <StepCard
                    step={listItem.step}
                    dragHandle={dragHandle}
                    isLocked={isLocked}
                    isSwiftClose={swiftCloseId === listItem.step.id}
                    isCollapsed={collapsedIds.has(listItem.step.id)}
                    isEditing={editingId === listItem.step.id}
                    onToggleCollapsed={() =>
                      onToggleCollapsed(listItem.step.id)
                    }
                    onEdit={(isEditing) =>
                      onEdit(isEditing ? listItem.step.id : null)
                    }
                    onChange={onChangeStep}
                    onDiscard={() => onDiscardEdit(listItem.step.id)}
                    onTrash={() => onTrashStep(listItem.step.id)}
                  />
                )}
              </SortableStep>
            ),
          )}
        </ol>
      </SortableContext>

      <p role="status" className="screen-reader-only">
        {announcement}
      </p>

      <DragOverlay dropAnimation={null}>
        {activeStep && (
          <DragSwingOverlay
            hasMotion={hasMotion}
            onRelease={(rect, rotation) => {
              const target = stepNodes.current.get(activeStep.id)
              if (hasMotion && target) {
                setSettling({ id: activeStep.id, target, rect, rotation })
              }
            }}
          >
            {renderStaticCard(activeStep)}
          </DragSwingOverlay>
        )}
      </DragOverlay>

      {settling && settlingStep && (
        <SettlingOverlay
          target={settling.target}
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
