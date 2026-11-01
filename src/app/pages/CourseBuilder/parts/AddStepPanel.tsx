import { BubbleBurst } from '../../../components/BubbleBurst/BubbleBurst'
import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import { useBubbleBurst } from '../../../hooks/useBubbleBurst'
import { stepTypeLabel, stepTypes, type StepType } from '../../../model/course'
import './AddStepPanel.css'

interface AddStepPanelProps {
  message?: string
  onAddStep: (type: StepType) => void
}

interface AddStepButtonProps {
  type: StepType
  onAddStep: (type: StepType) => void
}

const AddStepButton = ({ type, onAddStep }: AddStepButtonProps) => {
  const { burst, triggerBurst } = useBubbleBurst()

  return (
    <IconButton
      label={`Add ${stepTypeLabel[type].toLowerCase()} step`}
      className="add-step-button"
      onPress={() => {
        triggerBurst()
        onAddStep(type)
      }}
    >
      <StepTypeIcon type={type} />
      <BubbleBurst burst={burst} />
    </IconButton>
  )
}

export const AddStepPanel = ({ message, onAddStep }: AddStepPanelProps) => (
  <div
    className="add-step-panel"
    data-scroll-anchor="add-step"
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
        <AddStepButton key={type} type={type} onAddStep={onAddStep} />
      ))}
    </div>
  </div>
)
