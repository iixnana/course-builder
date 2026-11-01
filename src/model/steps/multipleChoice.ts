import { isBlank } from '../../utils/isBlank'
import type { StepDefinition } from './stepDefinition'

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

const createOption = (): ChoiceOption => ({
  id: crypto.randomUUID(),
  text: '',
})

export const createMultipleChoiceStep = (): MultipleChoiceStep => {
  const options = [createOption(), createOption()]
  return {
    id: crypto.randomUUID(),
    type: 'multipleChoice',
    question: '',
    options,
    correctOptionIds: [options[0].id],
  }
}

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

export const multipleChoiceStep: StepDefinition<MultipleChoiceStep> = {
  label: 'Question',
  summary: (step) => step.question || 'Write your question',
  isUntouched: (step) =>
    isBlank(step.question) &&
    step.options.length === 2 &&
    step.options.every((option) => isBlank(option.text)) &&
    step.correctOptionIds.join() === step.options[0].id,
}
