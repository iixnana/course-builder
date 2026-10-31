import { Circle, CircleCheck, ImageIcon } from 'lucide-react'
import type { Step } from '../../../model/course'
import './StepPreview.css'

interface StepPreviewProps {
  step: Step
}

export const StepPreview = ({ step }: StepPreviewProps) => {
  switch (step.type) {
    case 'text':
      return step.body.trim() ? (
        <p className="step-text">{step.body}</p>
      ) : (
        <p className="step-empty">No text yet.</p>
      )
    case 'image':
      return step.url ? (
        <img className="step-image" src={step.url} alt={step.alt} />
      ) : (
        <div className="step-image-placeholder">
          <ImageIcon aria-hidden="true" />
          <p>No image yet.</p>
        </div>
      )
    case 'multipleChoice':
      return (
        <ul className="step-options" aria-label="Answers">
          {step.options.map((option) => {
            const isCorrect = option.id === step.correctOptionId
            return (
              <li
                key={option.id}
                className="step-option"
                data-correct={isCorrect || undefined}
              >
                {isCorrect ? (
                  <CircleCheck aria-hidden="true" />
                ) : (
                  <Circle aria-hidden="true" />
                )}
                <span>{option.text || 'Empty answer'}</span>
                {isCorrect && (
                  <span className="screen-reader-only">(correct answer)</span>
                )}
              </li>
            )
          })}
        </ul>
      )
  }
}
