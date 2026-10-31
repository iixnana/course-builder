import { TextField } from '../../../components/TextField/TextField'
import type { TextStep } from '../../../model/course'

interface TextStepEditorProps {
  step: TextStep
  onChange: (step: TextStep) => void
}

export const TextStepEditor = ({ step, onChange }: TextStepEditorProps) => (
  <TextField
    label="Text"
    isMultiline
    autoFocus
    placeholder="What should the trainee read?"
    value={step.body}
    onChange={(body) => onChange({ ...step, body })}
  />
)
