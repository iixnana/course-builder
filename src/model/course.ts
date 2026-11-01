import { isUntouchedStep, type Step } from './step'

export interface TrashedStep {
  step: Step
  position: number
}

export interface Course {
  id: string
  title: string
  steps: Step[]
  trash: TrashedStep[]
}

export const renameCourse = (course: Course, title: string): Course => ({
  ...course,
  title,
})

export const addStep = (course: Course, step: Step): Course => ({
  ...course,
  steps: [...course.steps, step],
})

export const updateStep = (course: Course, step: Step): Course => ({
  ...course,
  steps: course.steps.map((current) =>
    current.id === step.id ? step : current,
  ),
})

export const moveSteps = (
  course: Course,
  ids: string[],
  targetId: string,
  position: 'before' | 'after',
): Course => {
  const moving = course.steps.filter((step) => ids.includes(step.id))
  const rest = course.steps.filter((step) => !ids.includes(step.id))
  const targetIndex = rest.findIndex((step) => step.id === targetId)
  if (targetIndex === -1) return course
  const insertAt = position === 'before' ? targetIndex : targetIndex + 1
  return {
    ...course,
    steps: [...rest.slice(0, insertAt), ...moving, ...rest.slice(insertAt)],
  }
}

export const trashStep = (course: Course, id: string): Course => {
  const position = course.steps.findIndex((step) => step.id === id)
  if (position === -1) return course
  const step = course.steps[position]
  return {
    ...course,
    steps: course.steps.filter((current) => current.id !== id),
    trash: isUntouchedStep(step)
      ? course.trash
      : [{ step, position }, ...course.trash],
  }
}

export const restoreStep = (course: Course, id: string): Course => {
  const trashed = course.trash.find((item) => item.step.id === id)
  if (!trashed) return course
  const insertAt = Math.min(trashed.position, course.steps.length)
  return {
    ...course,
    steps: [
      ...course.steps.slice(0, insertAt),
      trashed.step,
      ...course.steps.slice(insertAt),
    ],
    trash: course.trash.filter((item) => item.step.id !== id),
  }
}

export const restoreAllSteps = (course: Course): Course =>
  course.trash.reduce(
    (restored, { step }) => restoreStep(restored, step.id),
    course,
  )

export const emptyTrash = (course: Course): Course => ({ ...course, trash: [] })
