import { useLayoutEffect, useState } from 'react'
import type { Step } from '../model/step'
import { motion } from '../utils/presence'

const isReordered = (before: Step[], after: Step[]) => {
  const ids = new Set(after.map((step) => step.id))
  const kept = before.filter((step) => ids.has(step.id))
  const keptIds = new Set(kept.map((step) => step.id))
  const reordered = after.filter((step) => keptIds.has(step.id))
  return kept.some((step, index) => step.id !== reordered[index].id)
}

const readStepOffsets = (list: HTMLElement | null) => {
  const offsets = new Map<string, number>()
  if (!list) return offsets
  for (const item of list.querySelectorAll<HTMLElement>('[data-step-id]')) {
    offsets.set(item.dataset.stepId ?? '', item.offsetTop - list.offsetTop)
  }
  return offsets
}

export const useReorderFlip = (
  steps: Step[],
  list: HTMLElement | null,
  hasMotion: boolean,
) => {
  const [previousSteps, setPreviousSteps] = useState(steps)
  const [flipFrom, setFlipFrom] = useState<Map<string, number> | null>(null)
  const [isSkipping, setIsSkipping] = useState(false)

  if (steps !== previousSteps) {
    setPreviousSteps(steps)
    if (isSkipping) {
      setIsSkipping(false)
    } else if (hasMotion && isReordered(previousSteps, steps)) {
      setFlipFrom(readStepOffsets(list))
    }
  }

  useLayoutEffect(() => {
    if (!flipFrom || !list) return
    const timing = motion()
    for (const item of list.querySelectorAll<HTMLElement>('[data-step-id]')) {
      const from = flipFrom.get(item.dataset.stepId ?? '')
      if (from === undefined) continue
      const delta = from - (item.offsetTop - list.offsetTop)
      if (Math.abs(delta) < 1) continue
      item.animate(
        [{ translate: `0 ${delta}px` }, { translate: '0 0' }],
        timing,
      )
    }
  }, [flipFrom, list])

  const skipNextFlip = () => setIsSkipping(true)

  return skipNextFlip
}
