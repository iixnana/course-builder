import type { ReactNode } from 'react'
import {
  Button,
  composeRenderProps,
  ToggleButton,
  Tooltip,
  TooltipTrigger,
  type ButtonProps,
  type ToggleButtonProps,
} from 'react-aria-components'
import './IconButton.css'

interface IconButtonLabel {
  label: string
  children: ReactNode
}

type IconButtonProps = IconButtonLabel &
  Omit<ButtonProps, 'children' | 'aria-label'>

type IconToggleButtonProps = IconButtonLabel &
  Omit<ToggleButtonProps, 'children' | 'aria-label'>

const withIconButtonClass = (className?: string) =>
  className ? `icon-button ${className}` : 'icon-button'

export const IconButton = ({
  label,
  children,
  className,
  ...props
}: IconButtonProps) => (
  <TooltipTrigger delay={600}>
    <Button
      {...props}
      aria-label={label}
      className={composeRenderProps(className, withIconButtonClass)}
    >
      {children}
    </Button>
    <Tooltip className="tooltip">{label}</Tooltip>
  </TooltipTrigger>
)

export const IconToggleButton = ({
  label,
  children,
  className,
  ...props
}: IconToggleButtonProps) => (
  <TooltipTrigger delay={600}>
    <ToggleButton
      {...props}
      aria-label={label}
      className={composeRenderProps(className, withIconButtonClass)}
    >
      {children}
    </ToggleButton>
    <Tooltip className="tooltip">{label}</Tooltip>
  </TooltipTrigger>
)
