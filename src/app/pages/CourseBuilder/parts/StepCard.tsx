import { Check, ChevronDown, Pencil, Trash2, TriangleAlert } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import { useContentSwap } from '../../../hooks/useContentSwap'
import {
  stepIssues,
  stepSummary,
  stepTypeLabel,
  type Step,
} from '../../../model/course'
import { StepEditor } from './StepEditor'
import { StepPreview } from './StepPreview'
import './StepCard.css'

interface StepCardProps {
  step: Step
  dragHandle: ReactNode
  isCollapsed: boolean
  isEditing: boolean
  onToggleCollapsed: () => void
  onEdit: (isEditing: boolean) => void
  onChange: (step: Step) => void
  onTrash: () => void
}

export const StepCard = ({
  step,
  dragHandle,
  isCollapsed,
  isEditing,
  onToggleCollapsed,
  onEdit,
  onChange,
  onTrash,
}: StepCardProps) => {
  const bodyId = useId()
  const issues = stepIssues(step)
  const bodyClip = useRef<HTMLDivElement>(null)
  useContentSwap(bodyClip, isEditing)

  return (
    <div className="step-card-content" data-editing={isEditing || undefined}>
      <div className="step-card-header">
        {dragHandle}
        <span className="step-type-badge">
          <StepTypeIcon type={step.type} className="step-type-icon" />
        </span>
        <h3 className="step-card-title">
          <span className="screen-reader-only">
            {stepTypeLabel[step.type]} step
            {issues.length > 0 && ', has errors'}:{' '}
          </span>
          {stepSummary(step)}
        </h3>
        {issues.length > 0 && (
          <TriangleAlert className="step-warning-icon" aria-hidden="true" />
        )}
        <div className="step-card-actions">
          <IconButton
            label={isCollapsed ? 'Expand step' : 'Collapse step'}
            aria-expanded={!isCollapsed}
            aria-controls={bodyId}
            className="step-collapse-button"
            onPress={onToggleCollapsed}
          >
            <ChevronDown />
          </IconButton>
          <IconButton
            label={isEditing ? 'Done editing' : 'Edit step'}
            className="step-edit-button"
            onPress={() => onEdit(!isEditing)}
          >
            {isEditing ? <Check /> : <Pencil />}
          </IconButton>
          <IconButton
            label="Delete step"
            className="step-delete-button"
            onPress={onTrash}
          >
            <Trash2 />
          </IconButton>
        </div>
      </div>

      <div
        id={bodyId}
        className="step-card-body"
        data-collapsed={isCollapsed || undefined}
        inert={isCollapsed}
      >
        <div ref={bodyClip} className="step-card-body-clip">
          <div className="step-card-body-content">
            {isEditing ? (
              <StepEditor
                step={step}
                onChange={onChange}
                onDone={() => onEdit(false)}
              />
            ) : (
              <StepPreview step={step} />
            )}
            {issues.length > 0 && (
              <ul className="step-issues" aria-label="Still to do">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
