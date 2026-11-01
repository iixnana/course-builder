import { CircleCheck, Plus, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { prefersReducedMotion } from '../../../../hooks/usePrefersReducedMotion'
import { animatePresence } from '../../../../utils/presence'
import { Button } from '../../../components/Button/Button'
import {
  IconButton,
  IconToggleButton,
} from '../../../components/IconButton/IconButton'
import { TextField } from '../../../components/TextField/TextField'
import {
  addOption,
  isCorrectOption,
  setCorrect,
  placeholderText,
  removeOption,
  setQuestion,
  updateOption,
  type ChoiceOption,
  type MultipleChoiceStep,
} from '../../../../model/course'

interface QuestionStepEditorProps {
  step: MultipleChoiceStep
  onChange: (step: MultipleChoiceStep) => void
}

interface AnswerRowProps {
  step: MultipleChoiceStep
  option: ChoiceOption
  index: number
  canRemove: boolean
  isListMounted: () => boolean
  onChange: (step: MultipleChoiceStep) => void
  onRemove: (id: string, row: HTMLLIElement) => void
}

const minimumAnswers = 2

const AnswerRow = ({
  step,
  option,
  index,
  canRemove,
  isListMounted,
  onChange,
  onRemove,
}: AnswerRowProps) => {
  const row = useRef<HTMLLIElement>(null)
  const hasEntered = useRef(false)

  useLayoutEffect(() => {
    if (hasEntered.current || !row.current) return
    hasEntered.current = true
    if (isListMounted() && !prefersReducedMotion()) {
      void animatePresence(row.current, 'enter')
    }
  }, [isListMounted])

  return (
    <li
      ref={row}
      className="answer-row"
      data-correct={isCorrectOption(step, option.id) || undefined}
    >
      <IconToggleButton
        label={`Mark Option ${index + 1} as Correct`}
        className="answer-correct-toggle"
        isSelected={isCorrectOption(step, option.id)}
        onChange={(isSelected) =>
          onChange(setCorrect(step, option.id, isSelected))
        }
      >
        <CircleCheck />
      </IconToggleButton>
      <TextField
        label={`Option ${index + 1}`}
        isLabelHidden
        placeholder={placeholderText.option(index)}
        value={option.text}
        onChange={(text) => onChange(updateOption(step, option.id, text))}
      />
      <IconButton
        label="Delete"
        isDisabled={!canRemove}
        onPress={() => {
          if (row.current) onRemove(option.id, row.current)
        }}
      >
        <X />
      </IconButton>
    </li>
  )
}

export const QuestionStepEditor = ({
  step,
  onChange,
}: QuestionStepEditorProps) => {
  const answersId = useId()
  const [leavingIds, setLeavingIds] = useState<ReadonlySet<string>>(new Set())
  const isMounted = useRef(false)
  const isListMounted = useCallback(() => isMounted.current, [])
  const latest = useRef({ step, onChange })

  useLayoutEffect(() => {
    latest.current = { step, onChange }
  })

  useEffect(() => {
    isMounted.current = true
  }, [])

  const removeAnswer = (id: string, row: HTMLLIElement) => {
    setLeavingIds((ids) => new Set(ids).add(id))
    row.inert = true
    const finish = () => {
      latest.current.onChange(removeOption(latest.current.step, id))
      setLeavingIds((ids) => {
        const next = new Set(ids)
        next.delete(id)
        return next
      })
    }
    if (prefersReducedMotion()) finish()
    else void animatePresence(row, 'exit').then(finish)
  }

  const remaining = step.options.length - leavingIds.size

  return (
    <>
      <TextField
        label="Question"
        placeholder={placeholderText.question}
        value={step.question}
        onChange={(question) => onChange(setQuestion(step, question))}
      />
      <div role="group" aria-labelledby={answersId}>
        <p id={answersId} className="answers-label">
          Options (mark every correct one)
        </p>
        <ul className="answer-list">
          {step.options.map((option, index) => (
            <AnswerRow
              key={option.id}
              step={step}
              option={option}
              index={index}
              canRemove={remaining > minimumAnswers}
              isListMounted={isListMounted}
              onChange={onChange}
              onRemove={removeAnswer}
            />
          ))}
        </ul>
      </div>
      <Button
        className="add-answer-button"
        onPress={() => onChange(addOption(step))}
      >
        <Plus aria-hidden="true" />
        Add Option
      </Button>
    </>
  )
}
