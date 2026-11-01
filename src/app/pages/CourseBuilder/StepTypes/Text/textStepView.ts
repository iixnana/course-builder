import type { TextStep } from '../../../../../model/steps/text'
import type { StepTypeView } from '../StepTypeView'
import { AddTextStepButton } from './AddTextStepButton'
import { TextStepEditor } from './TextStepEditor'
import { TextStepPreview } from './TextStepPreview'

export const textStepView: StepTypeView<TextStep> = {
  Editor: TextStepEditor,
  Preview: TextStepPreview,
  AddButton: AddTextStepButton,
}
