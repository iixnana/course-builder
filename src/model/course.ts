import { richTextToPlainText } from '../utils/richText'

export interface TextStep {
  id: string
  type: 'text'
  title: string
  body: string
}

export interface ImageStep {
  id: string
  type: 'image'
  title: string
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
  correctOptionIds: string[]
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

export const placeholderText = {
  title: 'e.g. Hairnets in the Inventing Room',
  body: 'Write what your trainees should learn in this step.',
  question: 'What should your trainees answer?',
  option: (index: number) => `Option ${index + 1}`,
}

const defaultImageTitle = 'New image'

export const createStep = (type: Exclude<StepType, 'image'>): Step => {
  const id = crypto.randomUUID()
  switch (type) {
    case 'text':
      return { id, type, title: '', body: '' }
    case 'multipleChoice': {
      const options = [createOption(), createOption()]
      return {
        id,
        type,
        question: '',
        options,
        correctOptionIds: [options[0].id],
      }
    }
  }
}

export interface PickedImage {
  url: string
  title: string
}

export const createImageStep = ({ url, title }: PickedImage): ImageStep => ({
  id: crypto.randomUUID(),
  type: 'image',
  title,
  url,
  alt: '',
})

const looksLikeWords = (name: string) =>
  /\p{L}{2}/u.test(name) && !/\d{5}/.test(name)

const isHash = (word: string) =>
  word.length >= 6 && /\d/.test(word) && /\p{L}/u.test(word)

export const imageTitleFromName = (fileName: string) => {
  const name = fileName
    .replace(/\.[a-z0-9]+$/i, '')
    .split(/[-_.+\s]+/)
    .filter((word) => word && !isHash(word))
    .join(' ')
  if (!looksLikeWords(name)) return defaultImageTitle
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const stepSummary = (step: Step): string => {
  switch (step.type) {
    case 'text':
      return (
        step.title.trim() || richTextToPlainText(step.body) || 'Add your text'
      )
    case 'image':
      return step.title.trim() || 'Name your image'
    case 'multipleChoice':
      return step.question || 'Write your question'
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

const isBlank = (text: string) => text.trim() === ''

export const isUntouched = (step: Step): boolean => {
  switch (step.type) {
    case 'text':
      return isBlank(step.title) && isBlank(richTextToPlainText(step.body))
    case 'image':
      return false
    case 'multipleChoice':
      return (
        isBlank(step.question) &&
        step.options.length === 2 &&
        step.options.every((option) => isBlank(option.text)) &&
        step.correctOptionIds.join() === step.options[0].id
      )
  }
}

export const trashStep = (course: Course, id: string): Course => {
  const position = course.steps.findIndex((step) => step.id === id)
  if (position === -1) return course
  const step = course.steps[position]
  return {
    ...course,
    steps: course.steps.filter((current) => current.id !== id),
    trash: isUntouched(step)
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
): MultipleChoiceStep => {
  const options = step.options.filter((option) => option.id !== id)
  const correct = step.correctOptionIds.filter((correctId) => correctId !== id)
  return {
    ...step,
    options,
    correctOptionIds:
      correct.length > 0 || options.length === 0 ? correct : [options[0].id],
  }
}

export const isCorrectOption = (step: MultipleChoiceStep, id: string) =>
  step.correctOptionIds.includes(id)

export const setCorrect = (
  step: MultipleChoiceStep,
  id: string,
  isCorrect: boolean,
): MultipleChoiceStep => {
  const correctOptionIds = step.options
    .map((option) => option.id)
    .filter((optionId) =>
      optionId === id ? isCorrect : isCorrectOption(step, optionId),
    )
  return correctOptionIds.length > 0 ? { ...step, correctOptionIds } : step
}
