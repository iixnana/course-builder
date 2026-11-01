import { imageStep, type ImageStep } from './steps/image'
import {
  multipleChoiceStep,
  type MultipleChoiceStep,
} from './steps/multipleChoice'
import type { StepDefinition } from './steps/stepDefinition'
import { textStep, type TextStep } from './steps/text'

export type Step = TextStep | ImageStep | MultipleChoiceStep

export type StepType = Step['type']

export type StepOf<T extends StepType> = Extract<Step, { type: T }>

const stepDefinitions: { [T in StepType]: StepDefinition<StepOf<T>> } = {
  text: textStep,
  image: imageStep,
  multipleChoice: multipleChoiceStep,
}

export const stepTypes = Object.keys(stepDefinitions) as StepType[]

const definitionOf = (step: Step) =>
  stepDefinitions[step.type] as StepDefinition<Step>

export const stepTypeLabel = (type: StepType) => stepDefinitions[type].label

export const stepSummary = (step: Step) => definitionOf(step).summary(step)

export const isUntouchedStep = (step: Step) =>
  definitionOf(step).isUntouched(step)
