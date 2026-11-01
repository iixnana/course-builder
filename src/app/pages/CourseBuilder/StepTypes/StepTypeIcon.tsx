import type { StepType } from '../../../../model/step'
import { stepTypeIcons } from './stepTypeIcons'

interface StepTypeIconProps {
  type: StepType
  className?: string
}

export const StepTypeIcon = ({ type, className }: StepTypeIconProps) => {
  const Icon = stepTypeIcons[type]
  return <Icon className={className} aria-hidden="true" focusable="false" />
}
