import {
  Circle,
  CircleCheck,
  ImageIcon,
  Square,
  SquareCheck,
} from 'lucide-react'
import { RichText } from '../../../components/RichTextEditor/RichText'
import { isCorrectOption, type Step } from '../../../../model/course'
import { richTextToPlainText } from '../../../../utils/richText'
import './StepPreview.css'

interface StepPreviewProps {
  step: Step
}

export const StepPreview = ({ step }: StepPreviewProps) => {
  switch (step.type) {
    case 'text':
      return richTextToPlainText(step.body) ? (
        <RichText html={step.body} />
      ) : (
        <p className="step-empty">Edit this step to add your text.</p>
      )
    case 'image':
      return step.url ? (
        <figure className="step-figure">
          <img className="step-image" src={step.url} alt={step.alt} />
          {step.alt.trim() && (
            <figcaption className="step-image-caption" aria-hidden="true">
              {step.alt}
            </figcaption>
          )}
        </figure>
      ) : (
        <div className="step-image-placeholder">
          <ImageIcon aria-hidden="true" />
          <p>Edit this step to add an image.</p>
        </div>
      )
    case 'multipleChoice': {
      const hasSeveral = step.correctOptionIds.length > 1
      const [Unmarked, Marked] = hasSeveral
        ? [Square, SquareCheck]
        : [Circle, CircleCheck]
      return (
        <ul
          className="step-options"
          aria-label={
            hasSeveral
              ? `Answers, ${step.correctOptionIds.length} correct`
              : 'Answers'
          }
        >
          {step.options.map((option) => {
            const isCorrect = isCorrectOption(step, option.id)
            return (
              <li
                key={option.id}
                className="step-option"
                data-correct={isCorrect || undefined}
              >
                {isCorrect ? (
                  <Marked aria-hidden="true" />
                ) : (
                  <Unmarked aria-hidden="true" />
                )}
                {option.text ? (
                  <span>{option.text}</span>
                ) : (
                  <span className="step-empty">Write this answer</span>
                )}
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
}
