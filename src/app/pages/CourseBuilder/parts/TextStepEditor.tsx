import { RichTextEditor } from '../../../components/RichTextEditor/RichTextEditor'
import { TextField } from '../../../components/TextField/TextField'
import { placeholderText, type TextStep } from '../../../../model/course'

interface TextStepEditorProps {
  step: TextStep
  onChange: (step: TextStep) => void
}

export const TextStepEditor = ({ step, onChange }: TextStepEditorProps) => (
  <>
    <TextField
      label="Title (optional)"
      placeholder={placeholderText.title}
      value={step.title}
      onChange={(title) => onChange({ ...step, title })}
    />
    <RichTextEditor
      label="Text"
      placeholder={placeholderText.body}
      value={step.body}
      onChange={(body) => onChange({ ...step, body })}
    />
  </>
)
