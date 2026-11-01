import { IconButton } from '../../../components/IconButton/IconButton'
import { stepTypeLabel, type StepType } from '../../../../model/step'
import { StepTypeIcon } from '../StepTypes/StepTypeIcon'
import './AddStepPanel.css'

interface AddStepButtonProps {
  type: StepType
  onPress?: () => void
}

export const AddStepButton = ({ type, onPress }: AddStepButtonProps) => (
  <IconButton
    label={`Add ${stepTypeLabel(type)}`}
    variant="primary"
    className="add-step-button"
    onPress={onPress}
  >
    <StepTypeIcon type={type} />
  </IconButton>
)
