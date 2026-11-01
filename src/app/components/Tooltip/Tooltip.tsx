import { Tooltip as AriaTooltip } from 'react-aria-components'
import { overlayOffset } from '../overlayOffset'
import './Tooltip.css'

interface TooltipProps {
  label: string
}

export const Tooltip = ({ label }: TooltipProps) => (
  <AriaTooltip className="tooltip" placement="bottom" offset={overlayOffset}>
    {label}
  </AriaTooltip>
)
