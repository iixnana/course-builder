import { Link, composeRenderProps, type LinkProps } from 'react-aria-components'
import '../Button/Button.css'

export const ButtonLink = ({ className, children, ...props }: LinkProps) => (
  <Link
    {...props}
    className={composeRenderProps(className, (className) =>
      className ? `button ${className}` : 'button',
    )}
  >
    {children}
  </Link>
)
