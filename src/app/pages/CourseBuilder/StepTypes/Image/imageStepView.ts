import type { ImageStep } from '../../../../../model/steps/image'
import type { StepTypeView } from '../StepTypeView'
import { AddImageStepButton } from './AddImageStepButton'
import { ImageStepEditor } from './ImageStepEditor'
import { ImageStepPreview } from './ImageStepPreview'

export const imageStepView: StepTypeView<ImageStep> = {
  Editor: ImageStepEditor,
  Preview: ImageStepPreview,
  AddButton: AddImageStepButton,
}
