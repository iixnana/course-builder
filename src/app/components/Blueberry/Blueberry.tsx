import { classNames } from '../../../utils/classNames'
import './Blueberry.css'

interface BlueberryProps {
  mood?: 'plain' | 'sad'
  className?: string
}

export const Blueberry = ({ mood = 'plain', className }: BlueberryProps) => (
  <div className={classNames('blueberry', className)} aria-hidden="true">
    {mood === 'sad' && (
      <>
        <span className="blueberry-eye blueberry-eye-left" />
        <span className="blueberry-eye blueberry-eye-right" />
        <span className="blueberry-frown" />
      </>
    )}
  </div>
)
