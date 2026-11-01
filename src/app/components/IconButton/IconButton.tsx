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
import { useBubbleBurst } from '../../../hooks/useBubbleBurst'
import { BubbleBurst } from '../BubbleBurst/BubbleBurst'
import './IconButton.css'

interface IconButtonLabel {
  label: string
  children: ReactNode
}

type IconButtonProps = IconButtonLabel &
  Omit<ButtonProps, 'children' | 'aria-label'> & {
    variant?: 'ghost' | 'primary'
  }

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
  variant = 'ghost',
  onPress,
  ...props
}: IconButtonProps) => {
  const { burst, triggerBurst } = useBubbleBurst()
  const isPrimary = variant === 'primary'

  return (
    <IconTooltipTrigger>
      <Button
        {...props}
        aria-label={label}
        data-variant={variant}
        className={composeRenderProps(className, withIconButtonClass)}
        onPress={(event) => {
          if (isPrimary) triggerBurst()
          onPress?.(event)
        }}
      >
        {children}
        {isPrimary && <BubbleBurst burst={burst} />}
      </Button>
      <IconButtonTooltip label={label} />
    </IconTooltipTrigger>
  )
}

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
