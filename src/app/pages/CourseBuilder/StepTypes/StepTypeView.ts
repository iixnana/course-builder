import type { ComponentType } from 'react'
import type { Step } from '../../../../model/step'

export interface StepEditorProps<S> {
  step: S
  onChange: (step: S) => void
}

export interface StepPreviewProps<S> {
  step: S
}

export interface AddStepProps {
  onAddStep: (step: Step) => void
}

export interface StepTypeView<S> {
  Editor: ComponentType<StepEditorProps<S>>
  Preview: ComponentType<StepPreviewProps<S>>
  AddButton: ComponentType<AddStepProps>
}
