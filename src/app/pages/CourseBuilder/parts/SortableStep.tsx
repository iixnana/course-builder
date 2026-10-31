import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { DragHandle } from './DragHandle'

interface SortableStepProps {
  id: string
  isDragDisabled: boolean
  isPlaceholder: boolean
  isSettling: boolean
  isInvalid: boolean
  hasMotion: boolean
  children: (dragHandle: ReactNode) => ReactNode
}

export const SortableStep = ({
  id,
  isDragDisabled,
  isPlaceholder,
  isSettling,
  isInvalid,
  hasMotion,
  children,
}: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: isDragDisabled })

  return (
    <li
      ref={setNodeRef}
      className="card step-card"
      data-placeholder={isPlaceholder || undefined}
      data-settling-target={isSettling ? id : undefined}
      data-invalid={isInvalid || undefined}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: hasMotion ? transition : undefined,
      }}
    >
      {children(
        <DragHandle
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          disabled={isDragDisabled}
        />,
      )}
    </li>
  )
}
