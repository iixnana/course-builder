import { GripVertical } from 'lucide-react'
import type { ButtonHTMLAttributes, KeyboardEvent, Ref } from 'react'
import { Focusable } from 'react-aria-components'
import { Tooltip } from '../../../components/Tooltip/Tooltip'
import { TooltipTrigger } from '../../../components/Tooltip/TooltipTrigger'
import '../../../components/IconButton/IconButton.css'
import './DragHandle.css'

export type MoveDirection = -1 | 1

interface DragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  isDecorative?: boolean
  onMove?: (direction: MoveDirection) => void
}

const label = 'Drag to Reorder'

const directionOf = (key: string): MoveDirection | null =>
  key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : null

export const DragHandle = ({
  ref,
  disabled,
  isDecorative,
  onMove,
  ...props
}: DragHandleProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = directionOf(event.key)
    if (!direction || !onMove) return
    event.preventDefault()
    onMove(direction)
  }

  const button = (
    <button
      type="button"
      aria-label={label}
      {...props}
      disabled={disabled}
      ref={ref}
      className="icon-button step-drag-handle"
      onKeyDown={handleKeyDown}
    >
      <GripVertical aria-hidden="true" />
    </button>
  )

  if (isDecorative) return button

  return (
    <TooltipTrigger>
      <Focusable isDisabled={disabled}>{button}</Focusable>
      <Tooltip label={label} />
    </TooltipTrigger>
  )
}
