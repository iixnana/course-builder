import './BubbleBurst.css'

interface BubbleBurstProps {
  burst: number
}

export const BubbleBurst = ({ burst }: BubbleBurstProps) =>
  burst > 0 ? (
    <span key={burst} className="bubble-burst" aria-hidden="true" />
  ) : null
