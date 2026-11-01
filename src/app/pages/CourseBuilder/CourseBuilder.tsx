import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { appName } from '../../appName'
import { BlueberryLoader } from '../../components/BlueberryLoader/BlueberryLoader'
import {
  loaderAppearDelayMs,
  loaderMinimumMs,
} from '../../components/BlueberryLoader/loaderTiming'
import type { CourseRepository } from '../../../data/CourseRepository'
import { useCourseHistory } from '../../../data/useCourseHistory'
import {
  addStep,
  emptyTrash,
  moveSteps,
  renameCourse,
  restoreAllSteps,
  restoreStep,
  stepTypeLabel,
  trashStep,
  updateStep,
  type Step,
} from '../../../model/course'
import { redoLabel, undoLabel } from '../../../model/history'
import { isTextEntry } from '../../../utils/isTextEntry'
import { preloadCourseAssets } from '../../../utils/preloadCourseAssets'
import { simulatePrefetch } from '../../../utils/simulatePrefetch'
import {
  findAddStepPanel,
  findFirstVisibleStepElement,
  findStepElement,
  keepInView,
} from '../../../utils/keepInView'
import { demoResetEvent } from '../../layout/demoReset'
import { demoCourse } from '../../../data/demoCourse'
import { CourseBuilderView } from './CourseBuilder.view'
import { StepToolbar } from './parts/StepToolbar'

interface CourseBuilderProps {
  repository: CourseRepository
}

const withToggled = (ids: ReadonlySet<string>, id: string) => {
  const next = new Set(ids)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

const ignore = () => undefined

export const CourseBuilder = ({ repository }: CourseBuilderProps) => {
  const { loadState, updateCourse, undoChange, redoChange } =
    useCourseHistory(repository)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(
    new Set(),
  )
  const editSession = useRef(0)
  const editStart = useRef<Step | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const mountedAt = useRef(0)
  const loadedCourse =
    loadState.status === 'ready' ? loadState.history.present.state : null

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  useEffect(() => {
    if (!loadedCourse || isRevealed || isLoaderLeaving) return
    let isCancelled = false
    let frame = 0
    let timer = 0
    void Promise.all([
      preloadCourseAssets(loadedCourse),
      simulatePrefetch(),
    ]).then(() => {
      const elapsed = performance.now() - mountedAt.current
      const wasLoaderShown = elapsed >= loaderAppearDelayMs
      const hold = wasLoaderShown ? Math.max(0, loaderMinimumMs - elapsed) : 0
      timer = window.setTimeout(() => {
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            if (isCancelled) return
            if (wasLoaderShown) setIsLoaderLeaving(true)
            else setIsRevealed(true)
          })
        })
      }, hold)
    })
    return () => {
      isCancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [loadedCourse, isRevealed, isLoaderLeaving])

  const startEditing = useCallback((id: string | null) => {
    editSession.current += 1
    setEditingId(id)
    if (id) {
      setCollapsedIds((ids) => {
        const next = new Set(ids)
        next.delete(id)
        return next
      })
    }
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (isLocked || isTextEntry(event.target)) return
      if (!(event.metaKey || event.ctrlKey)) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undoChange()
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault()
        redoChange()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [undoChange, redoChange, isLocked])

  useEffect(() => {
    const resetToDemo = () => {
      startEditing(null)
      setCollapsedIds(new Set())
      setIsLocked(false)
      updateCourse(() => demoCourse, { label: 'Reset to demo course' })
    }
    window.addEventListener(demoResetEvent, resetToDemo)
    return () => window.removeEventListener(demoResetEvent, resetToDemo)
  }, [startEditing, updateCourse])

  if (loadState.status === 'error') {
    throw loadState.error
  }

  const withLoader = (content: ReactNode) => (
    <>
      {content}
      {!isRevealed && (
        <BlueberryLoader
          label={`Loading ${appName}`}
          isLeaving={isLoaderLeaving}
          onLeft={() => {
            setIsLoaderLeaving(false)
            setIsRevealed(true)
          }}
        />
      )}
    </>
  )

  if (loadState.status === 'loading') {
    return withLoader(
      <StepToolbar
        isDisabled
        stepCount={0}
        isAllCollapsed={false}
        isLocked={false}
        trash={[]}
        onUndo={ignore}
        onRedo={ignore}
        onToggleAll={ignore}
        onToggleLock={ignore}
        onRestoreStep={ignore}
        onRestoreAll={ignore}
        onEmptyTrash={ignore}
      />,
    )
  }

  const { history } = loadState
  const course = history.present.state
  const activeEditingId = course.steps.some((step) => step.id === editingId)
    ? editingId
    : null
  const isAllCollapsed =
    course.steps.length > 0 &&
    course.steps.every((step) => collapsedIds.has(step.id))

  return withLoader(
    <CourseBuilderView
      course={course}
      isRevealed={isRevealed}
      editingId={activeEditingId}
      collapsedIds={collapsedIds}
      undoLabel={undoLabel(history)}
      redoLabel={redoLabel(history)}
      isAllCollapsed={isAllCollapsed}
      isLocked={isLocked}
      onToggleLock={(shouldLock) => {
        if (shouldLock) startEditing(null)
        setIsLocked(shouldLock)
      }}
      onRenameCourse={(title) =>
        updateCourse((course) => renameCourse(course, title), {
          label: 'Rename course',
          mergeKey: 'title',
        })
      }
      onAddStep={(step: Step) => {
        keepInView(findAddStepPanel())
        updateCourse((course) => addStep(course, step), {
          label: `Add ${stepTypeLabel[step.type].toLowerCase()} step`,
        })
        editStart.current = step
        startEditing(step.id)
      }}
      onChangeStep={(step: Step) =>
        updateCourse((course) => updateStep(course, step), {
          label: 'Edit step',
          mergeKey: `edit:${step.id}:${editSession.current}`,
        })
      }
      onMoveSteps={(ids, targetId, position) =>
        updateCourse((course) => moveSteps(course, ids, targetId, position), {
          label: 'Reorder steps',
        })
      }
      onTrashStep={(id) => {
        if (editingId === id) startEditing(null)
        updateCourse((course) => trashStep(course, id), {
          label: 'Delete step',
        })
      }}
      onRestoreStep={(id) =>
        updateCourse((course) => restoreStep(course, id), {
          label: 'Restore step',
        })
      }
      onRestoreAll={() =>
        updateCourse(restoreAllSteps, { label: 'Restore all steps' })
      }
      onEmptyTrash={() =>
        updateCourse(emptyTrash, {
          label: 'Delete steps forever',
          isPermanent: true,
        })
      }
      onUndo={undoChange}
      onRedo={redoChange}
      onEdit={(id) => {
        editStart.current = course.steps.find((step) => step.id === id) ?? null
        startEditing(id)
      }}
      onDiscardEdit={(id) => {
        const original = editStart.current
        const current = course.steps.find((step) => step.id === id)
        startEditing(null)
        if (!original || original.id !== id || !current) return
        if (JSON.stringify(original) === JSON.stringify(current)) return
        updateCourse((course) => updateStep(course, original), {
          label: 'Discard changes',
        })
      }}
      onToggleCollapsed={(id) => {
        keepInView(findStepElement(id))
        if (editingId === id) startEditing(null)
        setCollapsedIds((ids) => withToggled(ids, id))
      }}
      onToggleAll={() => {
        keepInView(findFirstVisibleStepElement())
        if (isAllCollapsed) {
          setCollapsedIds(new Set())
        } else {
          startEditing(null)
          setCollapsedIds(new Set(course.steps.map((step) => step.id)))
        }
      }}
    />,
  )
}
