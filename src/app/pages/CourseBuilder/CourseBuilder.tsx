import { useRef, useState } from 'react'
import { appName } from '../../appName'
import { BlueberryLoader } from '../../components/BlueberryLoader/BlueberryLoader'
import type { CourseRepository } from '../../../data/CourseRepository'
import { useCourseReveal } from '../../../hooks/useCourseReveal'
import { useEditingSession } from '../../../hooks/useEditingSession'
import { useUndoRedoShortcuts } from '../../../hooks/useUndoRedoShortcuts'
import {
  addStep,
  emptyTrash,
  moveSteps,
  renameCourse,
  restoreAllSteps,
  restoreStep,
  trashStep,
  updateStep,
} from '../../../model/course'
import type { Step } from '../../../model/step'
import { canRedo, canUndo } from '../../../history/history'
import { useCourseHistory } from '../../../history/useCourseHistory'
import { firstOnScreen, keepInView } from '../../../utils/keepInView'
import { CourseBuilderView } from './CourseBuilder.view'
import { StepToolbar } from './StepToolbar/StepToolbar'

interface CourseBuilderProps {
  repository: CourseRepository
}

const withToggled = (ids: ReadonlySet<string>, id: string) => {
  const next = new Set(ids)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

const without = (ids: ReadonlySet<string>, id: string) => {
  const next = new Set(ids)
  next.delete(id)
  return next
}

export const CourseBuilder = ({ repository }: CourseBuilderProps) => {
  const { loadState, updateCourse, undoChange, redoChange } =
    useCourseHistory(repository)
  const history = loadState.status === 'ready' ? loadState.history : null
  const course = history?.present.state ?? null
  const { isRevealed, isLoaderLeaving, finishLeaving } = useCourseReveal(course)
  const editing = useEditingSession()
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(
    new Set(),
  )
  const [isLocked, setIsLocked] = useState(false)
  const addStepPanel = useRef<HTMLDivElement>(null)
  const stepList = useRef<HTMLOListElement>(null)

  useUndoRedoShortcuts(undoChange, redoChange, !isLocked)

  if (loadState.status === 'error') {
    throw loadState.error
  }

  const steps = course?.steps ?? []
  const findStep = (id: string | null) => steps.find((step) => step.id === id)
  const editingId = findStep(editing.editingId) ? editing.editingId : null
  const isAllCollapsed =
    steps.length > 0 && steps.every((step) => collapsedIds.has(step.id))

  const startEditing = (step: Step, closesSwiftly = false) => {
    editing.start(step, { closesSwiftly })
    setCollapsedIds((ids) => without(ids, step.id))
  }

  return (
    <>
      <StepToolbar
        isDisabled={!isRevealed}
        canUndo={history ? canUndo(history) : false}
        canRedo={history ? canRedo(history) : false}
        stepCount={steps.length}
        isAllCollapsed={isAllCollapsed}
        isLocked={isLocked}
        trash={course?.trash ?? []}
        onUndo={undoChange}
        onRedo={redoChange}
        onToggleLock={(shouldLock) => {
          if (shouldLock) editing.stop()
          setIsLocked(shouldLock)
        }}
        onToggleAll={() => {
          keepInView(firstOnScreen(stepList.current?.children ?? []))
          if (isAllCollapsed) {
            setCollapsedIds(new Set())
          } else {
            editing.stop()
            setCollapsedIds(new Set(steps.map((step) => step.id)))
          }
        }}
        onRestoreStep={(id) =>
          updateCourse((course) => restoreStep(course, id))
        }
        onRestoreAll={() => updateCourse(restoreAllSteps)}
        onEmptyTrash={() => updateCourse(emptyTrash, { isPermanent: true })}
      />
      {course && (
        <CourseBuilderView
          course={course}
          isRevealed={isRevealed}
          editingId={editingId}
          collapsedIds={collapsedIds}
          isLocked={isLocked}
          swiftCloseId={editing.swiftCloseId}
          ref={stepList}
          addStepPanelRef={addStepPanel}
          onRenameCourse={(title) =>
            updateCourse((course) => renameCourse(course, title), {
              mergeKey: 'title',
            })
          }
          onAddStep={(step) => {
            keepInView(addStepPanel.current)
            updateCourse((course) => addStep(course, step))
            startEditing(step, true)
          }}
          onChangeStep={(step) =>
            updateCourse((course) => updateStep(course, step), {
              mergeKey: editing.mergeKey(step.id),
            })
          }
          onMoveSteps={(ids, targetId, position) =>
            updateCourse((course) => moveSteps(course, ids, targetId, position))
          }
          onTrashStep={(id) => {
            if (editingId === id) editing.stop()
            updateCourse((course) => trashStep(course, id))
          }}
          onEdit={(id) => {
            const step = findStep(id)
            if (step) startEditing(step)
            else editing.stop()
          }}
          onDiscardEdit={(id) => {
            const original = editing.discard(findStep(id))
            if (!original) return
            updateCourse((course) => updateStep(course, original))
          }}
          onToggleCollapsed={(id) => {
            if (editingId === id) editing.stop()
            setCollapsedIds((ids) => withToggled(ids, id))
          }}
        />
      )}
      {!isRevealed && (
        <BlueberryLoader
          label={`Loading ${appName}`}
          isLeaving={isLoaderLeaving}
          onLeft={finishLeaving}
        />
      )}
    </>
  )
}
