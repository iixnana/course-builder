import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Step } from '../../../model/course'
import { prefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { isTextEntry } from '../../../utils/isTextEntry'
import { ImageStepEditor } from './ImageStepEditor'
import { QuestionStepEditor } from './QuestionStepEditor'
import { TextStepEditor } from './TextStepEditor'
import './StepEditor.css'

interface StepEditorProps {
  step: Step
  onChange: (step: Step) => void
  onDone: () => void
}

const firstFieldSelector = 'input:not([type="file"]), textarea'

export const StepEditor = ({ step, onChange, onDone }: StepEditorProps) => {
  const editor = useRef<HTMLDivElement>(null)

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

  const finishOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onDone()
  }

  return (
    <div ref={editor} className="step-editor" onKeyDown={finishOnEscape}>
      {step.type === 'text' && (
        <TextStepEditor step={step} onChange={onChange} />
      )}
      {step.type === 'image' && (
        <ImageStepEditor step={step} onChange={onChange} />
      )}
      {step.type === 'multipleChoice' && (
        <QuestionStepEditor step={step} onChange={onChange} />
      )}
    </div>
  )
}
