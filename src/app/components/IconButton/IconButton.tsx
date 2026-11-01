import type { ReactNode } from 'react'
import {
  Button,
  composeRenderProps,
  ToggleButton,
  Tooltip,
  TooltipTrigger,
  type ButtonProps,
  type ToggleButtonProps,
  type TooltipTriggerComponentProps,
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

const tooltipOffset = 6

export const IconTooltipTrigger = (props: TooltipTriggerComponentProps) => (
  <TooltipTrigger delay={600} closeDelay={0} {...props} />
)

export const IconButtonTooltip = ({
  label,
}: Pick<IconButtonLabel, 'label'>) => (
  <Tooltip className="tooltip" placement="bottom" offset={tooltipOffset}>
    {label}
  </Tooltip>
)

export const IconButton = ({
  label,
  children,
  className,
  ...props
}: IconButtonProps) => (
  <IconTooltipTrigger>
    <Button
      {...props}
      aria-label={label}
      className={composeRenderProps(className, withIconButtonClass)}
    >
      {children}
    </Button>
    <IconButtonTooltip label={label} />
  </IconTooltipTrigger>
)

export const IconToggleButton = ({
  label,
  children,
  className,
  ...props
}: IconToggleButtonProps) => (
  <IconTooltipTrigger>
    <ToggleButton
      {...props}
      aria-label={label}
      className={composeRenderProps(className, withIconButtonClass)}
    >
      {children}
    </ToggleButton>
    <IconButtonTooltip label={label} />
  </IconTooltipTrigger>
)
