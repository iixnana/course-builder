import { useEffect, useRef } from 'react'
import type { Step } from '../../../../model/step'
import { animatePresence } from '../../../../utils/presence'
import { DragHandle } from './DragHandle'
import { inertStepCardHandlers } from '../StepCard/inertStepCardHandlers'
import { StepCard } from '../StepCard/StepCard'

interface ExitingStepProps {
  step: Step
  isCollapsed: boolean
  isEditing: boolean
  onExited: (id: string) => void
}

const ignore = () => undefined

export const ExitingStep = ({
  step,
  isCollapsed,
  isEditing,
  onExited,
}: ExitingStepProps) => {
  const node = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const element = node.current
    if (!element) return
    let isCancelled = false
    const frame = requestAnimationFrame(() => {
      void animatePresence(element, 'exit').then(() => {
        if (!isCancelled) onExited(step.id)
      }, ignore)
    })
    return () => {
      isCancelled = true
      cancelAnimationFrame(frame)
      for (const animation of element.getAnimations()) animation.cancel()
    }
  }, [step.id, onExited])

  return (
    <li ref={node} className="card step-card" inert>
      <StepCard
        step={step}
        dragHandle={<DragHandle tabIndex={-1} isDecorative />}
        isCollapsed={isCollapsed}
        isEditing={isEditing}
        {...inertStepCardHandlers}
      />
    </li>
  )
}
