import type { PropsWithChildren } from 'react'
import { classNames } from '../../../utils/classNames'
import './GoldenTicket.css'

interface GoldenTicketProps {
  className?: string
}

export const GoldenTicket = ({
  className,
  children,
}: PropsWithChildren<GoldenTicketProps>) => (
  <div className="golden-ticket-shadow">
    <div className={classNames('golden-ticket', className)}>{children}</div>
  </div>
)
