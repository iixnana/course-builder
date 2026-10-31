export interface TextStep {
  id: string
  type: 'text'
  body: string
}

export interface ImageStep {
  id: string
  type: 'image'
  url: string
  alt: string
}

export interface ChoiceOption {
  id: string
  text: string
}

export interface MultipleChoiceStep {
  id: string
  type: 'multipleChoice'
  question: string
  options: ChoiceOption[]
  correctOptionId: string | null
}

export type Step = TextStep | ImageStep | MultipleChoiceStep

export type StepType = Step['type']

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

export const stepTypes: StepType[] = ['text', 'image', 'multipleChoice']

export const stepTypeLabel: Record<StepType, string> = {
  text: 'Text',
  image: 'Image',
  multipleChoice: 'Question',
}

export const createOption = (): ChoiceOption => ({
  id: crypto.randomUUID(),
  text: '',
})

export const createStep = (type: StepType): Step => {
  const id = crypto.randomUUID()
  switch (type) {
    case 'text':
      return { id, type, body: '' }
    case 'image':
      return { id, type, url: '', alt: '' }
    case 'multipleChoice':
      return {
        id,
        type,
        question: '',
        options: [createOption(), createOption()],
        correctOptionId: null,
      }
  }
}

export const stepSummary = (step: Step): string => {
  switch (step.type) {
    case 'text':
      return step.body.trim().split('\n')[0] || 'Empty text'
    case 'image':
      return step.alt || 'Untitled image'
    case 'multipleChoice':
      return step.question || 'Untitled question'
  }
}

export const stepIssues = (step: Step): string[] => {
  switch (step.type) {
    case 'text':
      return step.body.trim() ? [] : ['Add some text']
    case 'image':
      return [
        ...(step.url ? [] : ['Add an image']),
        ...(step.alt.trim() ? [] : ['Describe the image for screen readers']),
      ]
    case 'multipleChoice':
      return [
        ...(step.question.trim() ? [] : ['Write the question']),
        ...(step.options.length < 2 ? ['Add at least two answers'] : []),
        ...(step.options.some((option) => !option.text.trim())
          ? ['Fill in every answer']
          : []),
        ...(step.correctOptionId ? [] : ['Mark the correct answer']),
      ]
  }
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
  return {
    ...course,
    steps: course.steps.filter((step) => step.id !== id),
    trash: [{ step: course.steps[position], position }, ...course.trash],
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

export const emptyTrash = (course: Course): Course => ({ ...course, trash: [] })

export const setQuestion = (
  step: MultipleChoiceStep,
  question: string,
): MultipleChoiceStep => ({ ...step, question })

export const addOption = (step: MultipleChoiceStep): MultipleChoiceStep => ({
  ...step,
  options: [...step.options, createOption()],
})

export const updateOption = (
  step: MultipleChoiceStep,
  id: string,
  text: string,
): MultipleChoiceStep => ({
  ...step,
  options: step.options.map((option) =>
    option.id === id ? { ...option, text } : option,
  ),
})

export const removeOption = (
  step: MultipleChoiceStep,
  id: string,
): MultipleChoiceStep => ({
  ...step,
  options: step.options.filter((option) => option.id !== id),
  correctOptionId: step.correctOptionId === id ? null : step.correctOptionId,
})

export const markCorrect = (
  step: MultipleChoiceStep,
  id: string,
): MultipleChoiceStep => ({ ...step, correctOptionId: id })
