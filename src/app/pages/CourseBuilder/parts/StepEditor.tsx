import type { KeyboardEvent } from 'react'
import type { Step } from '../../../model/course'
import { ImageStepEditor } from './ImageStepEditor'
import { QuestionStepEditor } from './QuestionStepEditor'
import { TextStepEditor } from './TextStepEditor'
import './StepEditor.css'

interface StepEditorProps {
  step: Step
  onChange: (step: Step) => void
  onDone: () => void
}

export const StepEditor = ({ step, onChange, onDone }: StepEditorProps) => {
  const finishOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onDone()
  }

  return (
    <div className="step-editor" onKeyDown={finishOnEscape}>
      {step.type === 'text' && (
        <TextStepEditor step={step} onChange={onChange} />
      )}
      {step.type === 'image' && (
        <ImageStepEditor step={step} onChange={onChange} />
      )}
      {step.type === 'multipleChoice' && (
        <QuestionStepEditor step={step} onChange={onChange} />
      )}
    </div>
  )
}
