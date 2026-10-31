import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components'
import './Button.css'

interface ButtonProps extends AriaButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = ({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => (
  <AriaButton
    {...props}
    data-variant={variant}
    className={composeRenderProps(className, (className) =>
      className ? `button ${className}` : 'button',
    )}
  />
)
