import { Link, composeRenderProps, type LinkProps } from 'react-aria-components'
import { classNames } from '../../../utils/classNames'
import '../Button/Button.css'

export const ButtonLink = ({ className, children, ...props }: LinkProps) => (
  <Link
    {...props}
    className={composeRenderProps(className, (className) =>
      classNames('button', className),
    )}
  >
    {children}
  </Link>
)
