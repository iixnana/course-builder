import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { animatePresence } from '../../../utils/presence'
import { DragHandle } from './DragHandle'

interface SortableStepProps {
  id: string
  isDragDisabled: boolean
  isPlaceholder: boolean
  isSettling: boolean
  isInvalid: boolean
  hasMotion: boolean
  isListMounted: () => boolean
  children: (dragHandle: ReactNode) => ReactNode
}

export const SortableStep = ({
  id,
  isDragDisabled,
  isPlaceholder,
  isSettling,
  isInvalid,
  hasMotion,
  isListMounted,
  children,
}: SortableStepProps) => {
  const nodeRef = useRef<HTMLLIElement | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: isDragDisabled })

  const ref = useCallback(
    (element: HTMLLIElement | null) => {
      nodeRef.current = element
      setNodeRef(element)
    },
    [setNodeRef],
  )

  const [shouldEnter] = useState(hasMotion)
  const hasEntered = useRef(false)

  useLayoutEffect(() => {
    if (hasEntered.current || !nodeRef.current) return
    hasEntered.current = true
    if (!shouldEnter) return
    if (isListMounted()) void animatePresence(nodeRef.current, 'enter')
  }, [shouldEnter, isListMounted])

  return (
    <li
      ref={ref}
      className="card step-card"
      data-step-id={id}
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
