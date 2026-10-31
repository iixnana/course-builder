import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import { stepTypeLabel, stepTypes, type StepType } from '../../../model/course'
import './AddStepPanel.css'

interface AddStepPanelProps {
  message?: string
  onAddStep: (type: StepType) => void
}

export const AddStepPanel = ({ message, onAddStep }: AddStepPanelProps) => (
  <div
    className="add-step-panel"
    role="group"
    aria-label={message ? undefined : 'Add a step'}
    aria-labelledby={message ? 'add-step-title' : undefined}
  >
    {message && (
      <p id="add-step-title" className="add-step-message">
        {message}
      </p>
    )}
    <div className="add-step-buttons">
      {stepTypes.map((type) => (
        <IconButton
          key={type}
          label={`Add ${stepTypeLabel[type].toLowerCase()} step`}
          className="add-step-button"
          onPress={() => onAddStep(type)}
        >
          <StepTypeIcon type={type} />
        </IconButton>
      ))}
    </div>
  </div>
)
