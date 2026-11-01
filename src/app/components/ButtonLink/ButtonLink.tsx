import { composeRenderProps, Link, type LinkProps } from 'react-aria-components'
import { ButtonGoo } from '../Button/ButtonGoo'
import '../Button/Button.css'

export const ButtonLink = ({ className, children, ...props }: LinkProps) => (
  <Link
    {...props}
    className={composeRenderProps(className, (className) =>
      className ? `button ${className}` : 'button',
    )}
  >
    {composeRenderProps(children, (children) => (
      <>
        <ButtonGoo />
        {children}
      </>
    ))}
  </Link>
)
