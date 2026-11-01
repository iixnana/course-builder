import { Circle, CircleCheck, Square, SquareCheck } from 'lucide-react'
import {
  isCorrectOption,
  type MultipleChoiceStep,
} from '../../../../../model/steps/multipleChoice'
import type { StepPreviewProps } from '../StepTypeView'
import { optionPlaceholder } from './questionPlaceholders'
import './QuestionStepPreview.css'

export const QuestionStepPreview = ({
  step,
}: StepPreviewProps<MultipleChoiceStep>) => {
  const hasSeveral = step.correctOptionIds.length > 1
  const [Unmarked, Marked] = hasSeveral
    ? [Square, SquareCheck]
    : [Circle, CircleCheck]
  return (
    <ul
      className="step-options"
      aria-label={
        hasSeveral
          ? `Options, ${step.correctOptionIds.length} correct`
          : 'Options'
      }
    >
      {step.options.map((option, index) => {
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
              <span className="placeholder-text">
                {optionPlaceholder(index)}
              </span>
            )}
            {isCorrect && <span className="screen-reader-only">(correct)</span>}
          </li>
        )
      })}
    </ul>
  )
}
