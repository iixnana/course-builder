import { isBlank } from '../../utils/isBlank'
import { richTextToPlainText } from '../../utils/richText'
import type { StepDefinition } from './stepDefinition'

export interface TextStep {
  id: string
  type: 'text'
  title: string
  body: string
}

export const createTextStep = (): TextStep => ({
  id: crypto.randomUUID(),
  type: 'text',
  title: '',
  body: '',
})

export const textStep: StepDefinition<TextStep> = {
  label: 'Text',
  summary: (step) =>
    step.title.trim() || richTextToPlainText(step.body) || 'Add your text',
  isUntouched: (step) =>
    isBlank(step.title) && isBlank(richTextToPlainText(step.body)),
}
