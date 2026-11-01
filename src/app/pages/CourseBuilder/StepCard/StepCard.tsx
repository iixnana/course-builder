import { Check, ChevronDown, Pencil, Trash2, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { HideAway } from '../../../components/HideAway/HideAway'
import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import { useContentSwap } from '../../../../hooks/useContentSwap'
import { usePrefersReducedMotion } from '../../../../hooks/usePrefersReducedMotion'
import { motion } from '../../../../utils/presence'
import { keepTabWithin } from '../../../../utils/keepTabWithin'
import { stepSummary, stepTypeLabel, type Step } from '../../../../model/course'
import { StepEditor } from '../StepEditor/StepEditor'
import { StepPreview } from './StepPreview'
import './StepCard.css'

interface StepCardProps {
  step: Step
  dragHandle: ReactNode
  isLocked?: boolean
  isSwiftClose?: boolean
  isCollapsed: boolean
  isEditing: boolean
  onToggleCollapsed: () => void
  onEdit: (isEditing: boolean) => void
  onDiscard: () => void
  onChange: (step: Step) => void
  onTrash: () => void
}

export const StepCard = ({
  step,
  dragHandle,
  isLocked = false,
  isSwiftClose = false,
  isCollapsed,
  isEditing,
  onToggleCollapsed,
  onEdit,
  onDiscard,
  onChange,
  onTrash,
}: StepCardProps) => {
  const bodyId = useId()
  const card = useRef<HTMLDivElement>(null)
  const bodyClip = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const summary = stepSummary(step)

  const [isTitleCut, setIsTitleCut] = useState(false)
  const repeatsTitle = !(step.type === 'text' && !step.title.trim())

  useLayoutEffect(() => {
    const element = title.current
    if (!element) return
    const measure = () =>
      setIsTitleCut(element.scrollWidth > element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [summary])

  const hasMotion = !usePrefersReducedMotion()

  const [isShowingEditor, setIsShowingEditor] = useState(isEditing)
  const [wasCollapsed, setWasCollapsed] = useState(isCollapsed)
  if (wasCollapsed !== isCollapsed) {
    setWasCollapsed(isCollapsed)
    if (!isCollapsed) setIsShowingEditor(isEditing)
  }
  const isLeaving = !isCollapsed && isShowingEditor !== isEditing

  useEffect(() => {
    if (!isLeaving) return
    const fadeOut = hasMotion && !isSwiftClose ? motion().duration * 0.3 : 0
    const timer = window.setTimeout(
      () => setIsShowingEditor(isEditing),
      fadeOut,
    )
    return () => window.clearTimeout(timer)
  }, [isLeaving, isEditing, hasMotion, isSwiftClose])

  useContentSwap(bodyClip, isShowingEditor, { isMatchingEntry: isSwiftClose })

  const focusEditButton = () =>
    card.current?.querySelector<HTMLElement>('.step-edit-button')?.focus()

  const finishEditing = () => {
    onEdit(false)
    focusEditButton()
  }

  const discardEditing = () => {
    onDiscard()
    focusEditButton()
  }

  const handleEditingKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    keepTabWithin(event)
    const isOwnKey =
      event.target instanceof Node && event.currentTarget.contains(event.target)
    if (event.key === 'Escape' && isOwnKey) {
      finishEditing()
    }
  }

  return (
    <div
      ref={card}
      className="step-card-content"
      data-editing={isEditing || undefined}
      onKeyDown={isEditing ? handleEditingKeys : undefined}
    >
      <div className="step-card-header">
        <HideAway axis="inline" isHidden={isLocked}>
          {dragHandle}
        </HideAway>
        <span className="step-type-badge">
          <StepTypeIcon type={step.type} className="step-type-icon" />
        </span>
        <h3 ref={title} className="step-card-title">
          <span className="screen-reader-only">
            {stepTypeLabel[step.type]} step:{' '}
          </span>
          {summary}
        </h3>
        <div className="step-card-actions">
          <IconButton
            label={isCollapsed ? 'Expand' : 'Collapse'}
            aria-expanded={!isCollapsed}
            aria-controls={bodyId}
            className="step-collapse-button"
            onPress={onToggleCollapsed}
          >
            <ChevronDown />
          </IconButton>
          <HideAway axis="inline" isHidden={!isEditing}>
            <IconButton
              label="Discard Changes"
              className="step-discard-button"
              onPress={discardEditing}
            >
              <X />
            </IconButton>
          </HideAway>
          <HideAway
            axis="inline"
            isHidden={isLocked}
            className="step-card-edit-actions"
          >
            <IconButton
              label={isEditing ? 'Save' : 'Edit'}
              className="step-edit-button"
              onPress={isEditing ? finishEditing : () => onEdit(true)}
            >
              {isEditing ? <Check /> : <Pencil />}
            </IconButton>
            <IconButton
              label="Delete"
              className="step-delete-button"
              onPress={onTrash}
            >
              <Trash2 />
            </IconButton>
          </HideAway>
        </div>
      </div>

      <div
        id={bodyId}
        className="step-card-body"
        data-collapsed={isCollapsed || undefined}
        inert={isCollapsed}
      >
        <div ref={bodyClip} className="step-card-body-clip">
          <div
            className="step-card-body-content"
            data-leaving={isLeaving || undefined}
            inert={isLeaving}
          >
            {isShowingEditor ? (
              <StepEditor step={step} onChange={onChange} />
            ) : (
              <div className="step-view">
                {repeatsTitle && (
                  <HideAway axis="block" isHidden={!isTitleCut}>
                    <p className="step-full-title" aria-hidden="true">
                      {summary}
                    </p>
                  </HideAway>
                )}
                <StepPreview step={step} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
