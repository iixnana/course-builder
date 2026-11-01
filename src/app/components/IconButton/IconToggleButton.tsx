import type { ReactNode } from 'react'
import {
  composeRenderProps,
  ToggleButton,
  type ToggleButtonProps,
} from 'react-aria-components'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
import { iconButtonClass } from './iconButtonClass'
import './IconButton.css'

interface IconToggleButtonProps extends Omit<
  ToggleButtonProps,
  'children' | 'aria-label'
> {
  label: string
  children: ReactNode
}

export const IconToggleButton = ({
  label,
  children,
  className,
  ...props
}: IconToggleButtonProps) => (
  <TooltipTrigger>
    <ToggleButton
      {...props}
      aria-label={label}
      className={composeRenderProps(className, iconButtonClass)}
    >
      {children}
    </ToggleButton>
    <Tooltip label={label} />
  </TooltipTrigger>
)
