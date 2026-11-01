import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components'
import { useBubbleBurst } from '../../hooks/useBubbleBurst'
import { BubbleBurst } from '../BubbleBurst/BubbleBurst'
import { ButtonGoo } from './ButtonGoo'
import './Button.css'

interface ButtonProps extends AriaButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = ({
  variant = 'primary',
  className,
  children,
  onPress,
  ...props
}: ButtonProps) => {
  const { burst, triggerBurst } = useBubbleBurst()
  const hasBurst = variant === 'primary'

  return (
    <AriaButton
      {...props}
      data-variant={variant}
      className={composeRenderProps(className, (className) =>
        className ? `button ${className}` : 'button',
      )}
      onPress={(event) => {
        if (hasBurst) triggerBurst()
        onPress?.(event)
      }}
    >
      {composeRenderProps(children, (children) => (
        <>
          <ButtonGoo />
          {children}
          {hasBurst && <BubbleBurst burst={burst} />}
        </>
      ))}
    </AriaButton>
  )
}
