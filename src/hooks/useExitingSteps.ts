import { useCallback, useState } from 'react'
import type { Step } from '../../../../model/step'

export interface ExitingItem {
  step: Step
  index: number
  wasEditing: boolean
}

export const useExitingSteps = (
  steps: Step[],
  editingId: string | null,
  hasMotion: boolean,
) => {
  const [previousSteps, setPreviousSteps] = useState(steps)
  const [previousEditingId, setPreviousEditingId] = useState(editingId)
  const [exiting, setExiting] = useState<ExitingItem[]>([])

  if (steps !== previousSteps) {
    setPreviousSteps(steps)
    const ids = new Set(steps.map((step) => step.id))
    const removed = hasMotion
      ? previousSteps.flatMap((step, index) =>
          ids.has(step.id)
            ? []
            : [{ step, index, wasEditing: step.id === previousEditingId }],
        )
      : []
    setExiting((current) => [
      ...current.filter((item) => !ids.has(item.step.id)),
      ...removed,
    ])
  }
  if (editingId !== previousEditingId) setPreviousEditingId(editingId)

  const removeExiting = useCallback((id: string) => {
    setExiting((current) => current.filter((item) => item.step.id !== id))
  }, [])

  return { exiting, removeExiting }
}
