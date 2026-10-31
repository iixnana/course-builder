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

export interface Course {
  id: string
  title: string
  description: string
  steps: Step[]
}

export const stepTypeLabel: Record<StepType, string> = {
  text: 'Text',
  image: 'Image',
  multipleChoice: 'Multiple choice',
}

export const createStep = (type: StepType): Step => {
  const id = crypto.randomUUID()
  switch (type) {
    case 'text':
      return { id, type, body: '' }
    case 'image':
      return { id, type, url: '', alt: '' }
    case 'multipleChoice':
      return { id, type, question: '', options: [], correctOptionId: null }
  }
}

export const stepSummary = (step: Step): string => {
  switch (step.type) {
    case 'text':
      return step.body.split('\n')[0] || 'Empty text'
    case 'image':
      return step.alt || 'Untitled image'
    case 'multipleChoice':
      return step.question || 'Untitled question'
  }
}

export const addStep = (course: Course, type: StepType): Course => ({
  ...course,
  steps: [...course.steps, createStep(type)],
})
