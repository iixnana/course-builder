import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps,
} from 'react-aria-components'
import './Button.css'

export const Button = ({ className, ...props }: ButtonProps) => (
  <AriaButton
    {...props}
    className={composeRenderProps(className, (className) =>
      className ? `button ${className}` : 'button',
    )}
  />
)
