import { useRef, useState } from 'react'
import type { Step } from '../model/step'

const isSame = (a: Step, b: Step) => JSON.stringify(a) === JSON.stringify(b)

export const useEditingSession = () => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [swiftCloseId, setSwiftCloseId] = useState<string | null>(null)
  const session = useRef(0)
  const original = useRef<Step | null>(null)

  const start = (step: Step, { closesSwiftly = false } = {}) => {
    setSwiftCloseId(closesSwiftly ? editingId : null)
    session.current += 1
    original.current = step
    setEditingId(step.id)
  }

  const stop = () => {
    setSwiftCloseId(null)
    session.current += 1
    setEditingId(null)
  }

  const discard = (current: Step | undefined) => {
    const before = original.current
    stop()
    if (!before || !current || before.id !== current.id) return null
    return isSame(before, current) ? null : before
  }

  const mergeKey = (stepId: string) => `edit:${stepId}:${session.current}`

  return { editingId, swiftCloseId, start, stop, discard, mergeKey }
}
