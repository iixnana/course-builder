import { GripVertical } from 'lucide-react'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { Focusable } from 'react-aria-components'
import {
  IconButtonTooltip,
  IconTooltipTrigger,
} from '../../../components/IconButton/IconButton'

interface DragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  isDecorative?: boolean
}

const label = 'Drag to Reorder'

export const DragHandle = ({
  ref,
  disabled,
  isDecorative,
  ...props
}: DragHandleProps) => {
  const button = (
    <button
      type="button"
      aria-label={label}
      {...props}
      disabled={disabled}
      ref={ref}
      className="icon-button step-drag-handle"
    >
      <GripVertical aria-hidden="true" />
    </button>
  )

  if (isDecorative) return button

  return (
    <IconTooltipTrigger>
      <Focusable isDisabled={disabled}>{button}</Focusable>
      <IconButtonTooltip label={label} />
    </IconTooltipTrigger>
  )
}
