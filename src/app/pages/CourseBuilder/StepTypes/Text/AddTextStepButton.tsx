import { createTextStep } from '../../../../../model/steps/text'
import { AddStepButton } from '../../AddStep/AddStepButton'
import type { AddStepProps } from '../StepTypeView'

export const AddTextStepButton = ({ onAddStep }: AddStepProps) => (
  <AddStepButton type="text" onPress={() => onAddStep(createTextStep())} />
)
