import { GripVertical } from 'lucide-react'
import type { ButtonHTMLAttributes, Ref } from 'react'

interface DragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export const DragHandle = ({ ref, ...props }: DragHandleProps) => (
  <button
    type="button"
    aria-label="Drag to reorder"
    {...props}
    ref={ref}
    className="icon-button step-drag-handle"
  >
    <GripVertical aria-hidden="true" />
  </button>
)
