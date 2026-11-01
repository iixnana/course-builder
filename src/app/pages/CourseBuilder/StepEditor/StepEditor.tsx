import { useEffect, useRef } from 'react'
import type { Step } from '../../../../model/step'
import { prefersReducedMotion } from '../../../../hooks/usePrefersReducedMotion'
import { isTextEntry } from '../../../../utils/isTextEntry'
import { stepViewOf } from '../StepTypes/stepTypeViews'
import './StepEditor.css'

interface StepEditorProps {
  step: Step
  onChange: (step: Step) => void
}

const firstFieldSelector = 'input:not([type="file"]), textarea'

export const StepEditor = ({ step, onChange }: StepEditorProps) => {
  const editor = useRef<HTMLDivElement>(null)
  const { Editor } = stepViewOf(step)

  useEffect(() => {
    const element = editor.current
    if (!element) return
    const card = element.closest('[data-step-id]') ?? element
    let isCancelled = false
    const frame = requestAnimationFrame(() => {
      const animations = card.getAnimations({ subtree: true })
      void Promise.allSettled(animations.map(({ finished }) => finished)).then(
        () => {
          if (isCancelled || isTextEntry(document.activeElement)) return
          const field = element.querySelector<HTMLElement>(firstFieldSelector)
          if (!field) return
          field.focus({ preventScroll: true })
          field.scrollIntoView({
            block: 'nearest',
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          })
        },
      )
    })
    return () => {
      isCancelled = true
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={editor} className="step-editor">
      <Editor step={step} onChange={onChange} />
    </div>
  )
}
