import type { ReactNode, Ref } from 'react'
import {
  Button,
  composeRenderProps,
  type ButtonProps,
} from 'react-aria-components'
import { useBubbleBurst } from '../../../hooks/useBubbleBurst'
import { BubbleBurst } from '../BubbleBurst/BubbleBurst'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
import { iconButtonClass } from './iconButtonClass'
import './IconButton.css'

interface IconButtonProps extends Omit<ButtonProps, 'children' | 'aria-label'> {
  label: string
  children: ReactNode
  variant?: 'ghost' | 'primary'
  ref?: Ref<HTMLButtonElement>
}

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
    <TooltipTrigger>
      <Button
        {...props}
        aria-label={label}
        data-variant={variant}
        className={composeRenderProps(className, iconButtonClass)}
        onPress={(event) => {
          if (isPrimary) triggerBurst()
          onPress?.(event)
        }}
      >
        {children}
        {isPrimary && <BubbleBurst burst={burst} />}
      </Button>
      <Tooltip label={label} />
    </TooltipTrigger>
  )
}
