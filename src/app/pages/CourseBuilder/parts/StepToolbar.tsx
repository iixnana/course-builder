import {
  ChevronsDownUp,
  ChevronsUpDown,
  Redo2,
  Trash2,
  TriangleAlert,
  Undo2,
} from 'lucide-react'
import { DialogTrigger, Toolbar } from 'react-aria-components'
import { IconButton } from '../../../components/IconButton/IconButton'
import type { TrashedStep } from '../../../model/course'
import { TrashDialog } from './TrashDialog'
import './StepToolbar.css'

interface StepToolbarProps {
  undoLabel?: string
  redoLabel?: string
  stepCount: number
  invalidCount: number
  isAllCollapsed: boolean
  trash: TrashedStep[]
  onUndo: () => void
  onRedo: () => void
  onToggleAll: () => void
  onRestoreStep: (id: string) => void
  onEmptyTrash: () => void
}

export const StepToolbar = ({
  undoLabel,
  redoLabel,
  stepCount,
  invalidCount,
  isAllCollapsed,
  trash,
  onUndo,
  onRedo,
  onToggleAll,
  onRestoreStep,
  onEmptyTrash,
}: StepToolbarProps) => (
  <div className="step-toolbar-row">
    <div className="step-stats">
      <h2 id="course-steps-title" className="step-stats-count">
        {stepCount === 1 ? '1 step' : `${stepCount} steps`}
      </h2>
      <p role="status" className="step-stats-issues">
        {invalidCount > 0 && (
          <>
            <TriangleAlert aria-hidden="true" />
            {invalidCount === 1
              ? '1 step has errors'
              : `${invalidCount} steps have errors`}
          </>
        )}
      </p>
    </div>
    <Toolbar aria-label="Step actions" className="step-toolbar">
      <IconButton
        label={undoLabel ? `Undo: ${undoLabel}` : 'Nothing to undo'}
        isDisabled={!undoLabel}
        onPress={onUndo}
      >
        <Undo2 />
      </IconButton>
      <IconButton
        label={redoLabel ? `Redo: ${redoLabel}` : 'Nothing to redo'}
        isDisabled={!redoLabel}
        onPress={onRedo}
      >
        <Redo2 />
      </IconButton>
      <IconButton
        label={isAllCollapsed ? 'Expand all steps' : 'Collapse all steps'}
        isDisabled={stepCount === 0}
        onPress={onToggleAll}
      >
        {isAllCollapsed ? <ChevronsUpDown /> : <ChevronsDownUp />}
      </IconButton>
      <DialogTrigger>
        <IconButton
          label={
            trash.length === 1
              ? 'Trash, 1 step'
              : `Trash, ${trash.length} steps`
          }
        >
          <Trash2 />
          {trash.length > 0 && (
            <span className="step-toolbar-badge" aria-hidden="true">
              {trash.length}
            </span>
          )}
        </IconButton>
        <TrashDialog
          trash={trash}
          onRestoreStep={onRestoreStep}
          onEmptyTrash={onEmptyTrash}
        />
      </DialogTrigger>
    </Toolbar>
  </div>
)
