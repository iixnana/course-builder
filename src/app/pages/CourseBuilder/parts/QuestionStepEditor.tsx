import { CircleCheck, Plus, X } from 'lucide-react'
import { useId } from 'react'
import { Button } from '../../../components/Button/Button'
import {
  IconButton,
  IconToggleButton,
} from '../../../components/IconButton/IconButton'
import { TextField } from '../../../components/TextField/TextField'
import {
  addOption,
  markCorrect,
  removeOption,
  setQuestion,
  updateOption,
  type MultipleChoiceStep,
} from '../../../model/course'

interface QuestionStepEditorProps {
  step: MultipleChoiceStep
  onChange: (step: MultipleChoiceStep) => void
}

const minimumAnswers = 2

export const QuestionStepEditor = ({
  step,
  onChange,
}: QuestionStepEditorProps) => {
  const answersId = useId()

  return (
    <>
      <TextField
        label="Question"
        autoFocus
        placeholder="What should the trainee answer?"
        value={step.question}
        onChange={(question) => onChange(setQuestion(step, question))}
      />
      <div role="group" aria-labelledby={answersId}>
        <p id={answersId} className="answers-label">
          Answers (mark the correct one)
        </p>
        <ul className="answer-list">
          {step.options.map((option, index) => (
            <li key={option.id} className="answer-row">
              <IconToggleButton
                label={`Answer ${index + 1} is correct`}
                isSelected={option.id === step.correctOptionId}
                onChange={(isSelected) => {
                  if (isSelected) onChange(markCorrect(step, option.id))
                }}
              >
                <CircleCheck />
              </IconToggleButton>
              <TextField
                label={`Answer ${index + 1}`}
                isLabelHidden
                placeholder={`Answer ${index + 1}`}
                value={option.text}
                onChange={(text) =>
                  onChange(updateOption(step, option.id, text))
                }
              />
              <IconButton
                label={`Remove answer ${index + 1}`}
                isDisabled={step.options.length <= minimumAnswers}
                onPress={() => onChange(removeOption(step, option.id))}
              >
                <X />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
      <Button variant="secondary" onPress={() => onChange(addOption(step))}>
        <Plus aria-hidden="true" />
        Add answer
      </Button>
    </>
  )
}
