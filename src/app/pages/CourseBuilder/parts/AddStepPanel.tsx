import { DialogTrigger } from 'react-aria-components'
import { BubbleBurst } from '../../../components/BubbleBurst/BubbleBurst'
import { HideAway } from '../../../components/HideAway/HideAway'
import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import { useBubbleBurst } from '../../../../hooks/useBubbleBurst'
import {
  createImageStep,
  createStep,
  stepTypeLabel,
  stepTypes,
  type Step,
  type StepType,
} from '../../../../model/course'
import { ImagePickerDialog } from './ImagePickerDialog'
import './AddStepPanel.css'

interface AddStepPanelProps {
  isEmpty: boolean
  onAddStep: (step: Step) => void
}

interface AddStepButtonProps {
  type: StepType
  onPress?: () => void
}

const AddStepButton = ({ type, onPress }: AddStepButtonProps) => {
  const { burst, triggerBurst } = useBubbleBurst()

  return (
    <IconButton
      label={`Add ${stepTypeLabel[type]}`}
      className="add-step-button"
      onPress={() => {
        triggerBurst()
        onPress?.()
      }}
    >
      <StepTypeIcon type={type} />
      <BubbleBurst burst={burst} />
    </IconButton>
  )
}

export const AddStepPanel = ({ isEmpty, onAddStep }: AddStepPanelProps) => (
  <div
    className="add-step-panel"
    data-scroll-anchor="add-step"
    role="group"
    aria-label="Add a step"
  >
    <HideAway axis="block" isHidden={!isEmpty}>
      <p className="add-step-message">Add your first step</p>
    </HideAway>
    <div className="add-step-buttons">
      {stepTypes.map((type) =>
        type === 'image' ? (
          <DialogTrigger key={type}>
            <AddStepButton type={type} />
            <ImagePickerDialog
              title="Add an image"
              onPick={(image) => onAddStep(createImageStep(image))}
            />
          </DialogTrigger>
        ) : (
          <AddStepButton
            key={type}
            type={type}
            onPress={() => onAddStep(createStep(type))}
          />
        ),
      )}
    </div>
  </div>
)
