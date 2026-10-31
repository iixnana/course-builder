import { composeRenderProps, Link, type LinkProps } from 'react-aria-components'
import '../Button/Button.css'

export const ButtonLink = ({ className, ...props }: LinkProps) => (
  <Link
    {...props}
    className={composeRenderProps(className, (className) =>
      className ? `button ${className}` : 'button',
    )}
  />
)
