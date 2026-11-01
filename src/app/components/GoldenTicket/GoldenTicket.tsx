import type { PropsWithChildren } from 'react'
import './GoldenTicket.css'

interface GoldenTicketProps {
  className?: string
}

export const GoldenTicket = ({
  className,
  children,
}: PropsWithChildren<GoldenTicketProps>) => (
  <div className="golden-ticket-shadow">
    <div className={className ? `golden-ticket ${className}` : 'golden-ticket'}>
      {children}
    </div>
  </div>
)
