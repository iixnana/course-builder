import { RichTextEditor } from '../../../../components/RichTextEditor/RichTextEditor'
import { TextField } from '../../../../components/TextField/TextField'
import type { TextStep } from '../../../../../model/steps/text'
import type { StepEditorProps } from '../StepTypeView'

export const TextStepEditor = ({
  step,
  onChange,
}: StepEditorProps<TextStep>) => (
  <>
    <TextField
      label="Title (optional)"
      placeholder="e.g. Hairnets in the Inventing Room"
      value={step.title}
      onChange={(title) => onChange({ ...step, title })}
    />
    <RichTextEditor
      label="Text"
      placeholder="Write what your trainees should learn in this step."
      value={step.body}
      onChange={(body) => onChange({ ...step, body })}
    />
  </>
)
