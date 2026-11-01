import type { StepType } from '../../../../model/step'
import { StepTypeIcon } from './StepTypeIcon'
import './StepTypeBadge.css'

interface StepTypeBadgeProps {
  type: StepType
}

export const StepTypeBadge = ({ type }: StepTypeBadgeProps) => (
  <span className="step-type-badge">
    <StepTypeIcon type={type} className="step-type-icon" />
  </span>
)
