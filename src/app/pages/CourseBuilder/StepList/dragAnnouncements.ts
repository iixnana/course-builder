import type { Announcements, UniqueIdentifier } from '@dnd-kit/core'
import { stepSummary, type Step } from '../../../../model/step'

export const dragInstructions =
  'To reorder a step, drag its handle, or focus the handle and press the up or down arrow key.'

export const moveAnnouncement = (step: Step, position: number, count: number) =>
  `Moved "${stepSummary(step)}" to position ${position} of ${count}.`

export const edgeAnnouncement = (step: Step, direction: -1 | 1) =>
  `"${stepSummary(step)}" is already at the ${direction < 0 ? 'top' : 'bottom'}.`

export const dragAnnouncements = (steps: Step[]): Announcements => {
  const position = (id: UniqueIdentifier) =>
    steps.findIndex((step) => step.id === id) + 1
  const nameOf = (id: UniqueIdentifier) => {
    const step = steps.find((step) => step.id === id)
    return step ? `"${stepSummary(step)}"` : 'Step'
  }

  return {
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
}
