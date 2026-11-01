import { useLayoutEffect, useRef } from 'react'
import { stepIssues, type Step } from '../../../model/course'
import { animatePresence } from '../../../utils/presence'
import { DragHandle } from './DragHandle'
import { StepCard } from './StepCard'

interface ExitingStepProps {
  step: Step
  isCollapsed: boolean
  onExited: (id: string) => void
}

const ignore = () => undefined

export const ExitingStep = ({
  step,
  isCollapsed,
  onExited,
}: ExitingStepProps) => {
  const node = useRef<HTMLLIElement>(null)

  useLayoutEffect(() => {
    const element = node.current
    if (!element) return
    let isCancelled = false
    const finished = animatePresence(element, 'exit')
    void finished.then(() => {
      if (!isCancelled) onExited(step.id)
    }, ignore)
    return () => {
      isCancelled = true
      for (const animation of element.getAnimations()) animation.cancel()
    }
  }, [step.id, onExited])

  return (
    <li
      ref={node}
      className="card step-card"
      data-invalid={stepIssues(step).length > 0 || undefined}
      inert
    >
      <StepCard
        step={step}
        dragHandle={<DragHandle tabIndex={-1} isDecorative />}
        isCollapsed={isCollapsed}
        isEditing={false}
        onToggleCollapsed={ignore}
        onEdit={ignore}
        onChange={ignore}
        onTrash={ignore}
      />
    </li>
  )
}
