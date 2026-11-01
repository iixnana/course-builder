import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { appName } from '../../appName'
import { BlueberryLoader } from '../../components/BlueberryLoader/BlueberryLoader'
import {
  loaderAppearDelayMs,
  loaderMinimumMs,
} from '../../components/BlueberryLoader/loaderTiming'
import type { CourseRepository } from '../../data/CourseRepository'
import { useCourseHistory } from '../../data/useCourseHistory'
import {
  addStep,
  createStep,
  emptyTrash,
  moveSteps,
  renameCourse,
  restoreStep,
  stepTypeLabel,
  trashStep,
  updateStep,
  type Step,
  type StepType,
} from '../../model/course'
import { redoLabel, undoLabel } from '../../model/history'
import { isTextEntry } from '../../utils/isTextEntry'
import { preloadCourseAssets } from '../../utils/preloadCourseAssets'
import { simulatePrefetch } from '../../utils/simulatePrefetch'
import {
  findAddStepPanel,
  findFirstVisibleStepElement,
  findStepElement,
  keepInView,
} from '../../utils/keepInView'
import { CourseBuilderView } from './CourseBuilder.view'

interface CourseBuilderProps {
  repository: CourseRepository
}

const withToggled = (ids: ReadonlySet<string>, id: string) => {
  const next = new Set(ids)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export const CourseBuilder = ({ repository }: CourseBuilderProps) => {
  const { loadState, updateCourse, undoChange, redoChange } =
    useCourseHistory(repository)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(
    new Set(),
  )
  const editSession = useRef(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false)
  const mountedAt = useRef(0)
  const loadedCourse =
    loadState.status === 'ready' ? loadState.history.present.state : null

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  useEffect(() => {
    if (!loadedCourse || isRevealed) return
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
            setIsLoaderLeaving(wasLoaderShown)
            setIsRevealed(true)
          })
        })
      }, hold)
    })
    return () => {
      isCancelled = true
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [loadedCourse, isRevealed])

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
      if (isTextEntry(event.target)) return
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
  }, [undoChange, redoChange])

  if (loadState.status === 'error') {
    throw loadState.error
  }

  const withLoader = (content: ReactNode) => (
    <>
      {content}
      {(!isRevealed || isLoaderLeaving) && (
        <BlueberryLoader
          label={`Loading ${appName}`}
          isLeaving={isRevealed}
          onLeft={() => setIsLoaderLeaving(false)}
        />
      )}
    </>
  )

  if (loadState.status === 'loading') return withLoader(null)

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
      onRenameCourse={(title) =>
        updateCourse((course) => renameCourse(course, title), {
          label: 'Rename course',
          mergeKey: 'title',
        })
      }
      onAddStep={(type: StepType) => {
        keepInView(findAddStepPanel())
        const step = createStep(type)
        updateCourse((course) => addStep(course, step), {
          label: `Add ${stepTypeLabel[type].toLowerCase()} step`,
        })
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
      onEmptyTrash={() =>
        updateCourse(emptyTrash, { label: 'Empty trash', isPermanent: true })
      }
      onUndo={undoChange}
      onRedo={redoChange}
      onEdit={startEditing}
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
