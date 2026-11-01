import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { animatePresence } from '../../../../utils/presence'
import { DragHandle, type MoveDirection } from './DragHandle'

interface SortableStepProps {
  id: string
  isDragDisabled: boolean
  isPlaceholder: boolean
  hasMotion: boolean
  isListMounted: () => boolean
  onNode: (id: string, node: HTMLLIElement | null) => void
  onMove: (id: string, direction: MoveDirection) => void
  children: (dragHandle: ReactNode) => ReactNode
}

export const SortableStep = ({
  id,
  isDragDisabled,
  isPlaceholder,
  hasMotion,
  isListMounted,
  onNode,
  onMove,
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
      onNode(id, element)
    },
    [id, setNodeRef, onNode],
  )

  const [shouldEnter] = useState(hasMotion)
  const hasEntered = useRef(false)

  useLayoutEffect(() => {
    if (hasEntered.current || !nodeRef.current) return
    hasEntered.current = true
    if (!shouldEnter || !isListMounted()) return
    const element = nodeRef.current
    queueMicrotask(() => {
      if (element.isConnected) void animatePresence(element, 'enter')
    })
  }, [shouldEnter, isListMounted])

  return (
    <li
      ref={ref}
      className="card step-card"
      data-step-id={id}
      data-placeholder={isPlaceholder || undefined}
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
          aria-pressed={undefined}
          disabled={isDragDisabled}
          onMove={(direction) => onMove(id, direction)}
        />,
      )}
    </li>
  )
}
