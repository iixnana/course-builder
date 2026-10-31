import type { ComponentPropsWithoutRef, ElementType } from 'react'
import './Card.css'

type CardElement = 'div' | 'section' | 'article' | 'header' | 'li'

type CardProps<T extends CardElement> = {
  as?: T
} & ComponentPropsWithoutRef<T>

export const Card = <T extends CardElement = 'div'>({
  as,
  className,
  ...props
}: CardProps<T>) => {
  const Element = (as ?? 'div') as ElementType
  return (
    <Element className={className ? `card ${className}` : 'card'} {...props} />
  )
}
