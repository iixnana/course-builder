import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components'
import { useBubbleBurst } from '../../../hooks/useBubbleBurst'
import { classNames } from '../../../utils/classNames'
import { BubbleBurst } from '../BubbleBurst/BubbleBurst'
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

  return (
    <AriaButton
      {...props}
      data-variant={variant}
      className={composeRenderProps(className, (className) =>
        classNames('button', className),
      )}
      onPress={(event) => {
        triggerBurst()
        onPress?.(event)
      }}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <BubbleBurst burst={burst} />
        </>
      ))}
    </AriaButton>
  )
}
