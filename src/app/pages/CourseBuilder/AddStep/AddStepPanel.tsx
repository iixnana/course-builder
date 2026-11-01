import type { Ref } from 'react'
import { HideAway } from '../../../components/HideAway/HideAway'
import { stepTypes, type Step } from '../../../../model/step'
import { stepTypeViews } from '../StepTypes/stepTypeViews'
import './AddStepPanel.css'

interface AddStepPanelProps {
  ref?: Ref<HTMLDivElement>
  isEmpty: boolean
  onAddStep: (step: Step) => void
}

export const AddStepPanel = ({
  ref,
  isEmpty,
  onAddStep,
}: AddStepPanelProps) => (
  <div
    ref={ref}
    className="add-step-panel"
    role="group"
    aria-label="Add a step"
  >
    <HideAway axis="block" isHidden={!isEmpty}>
      <p className="add-step-message">Add your first step</p>
    </HideAway>
    <div className="add-step-buttons">
      {stepTypes.map((type) => {
        const { AddButton } = stepTypeViews[type]
        return <AddButton key={type} onAddStep={onAddStep} />
      })}
    </div>
  </div>
)
