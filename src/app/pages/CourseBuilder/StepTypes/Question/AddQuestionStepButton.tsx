import { createMultipleChoiceStep } from '../../../../../model/steps/multipleChoice'
import { AddStepButton } from '../../AddStep/AddStepButton'
import type { AddStepProps } from '../StepTypeView'

export const AddQuestionStepButton = ({ onAddStep }: AddStepProps) => (
  <AddStepButton
    type="multipleChoice"
    onPress={() => onAddStep(createMultipleChoiceStep())}
  />
)
