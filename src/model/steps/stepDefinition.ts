export interface StepDefinition<S> {
  label: string
  summary: (step: S) => string
  isUntouched: (step: S) => boolean
}
