import {
  ChevronsDownUp,
  ChevronsUpDown,
  Lock,
  LockOpen,
  Redo2,
  Trash2,
  Undo2,
} from 'lucide-react'
import { DialogTrigger } from 'react-aria-components'
import { IconButton } from '../../../components/IconButton/IconButton'
import { IconToggleButton } from '../../../components/IconButton/IconToggleButton'
import type { TrashedStep } from '../../../../model/course'
import { TrashPopover } from '../Trash/TrashPopover'
import { HeaderActions } from '../../../layout/HeaderActions'
import './StepToolbar.css'

interface StepToolbarProps {
  isDisabled?: boolean
  canUndo: boolean
  canRedo: boolean
  stepCount: number
  isAllCollapsed: boolean
  isLocked: boolean
  trash: TrashedStep[]
  onUndo: () => void
  onRedo: () => void
  onToggleAll: () => void
  onToggleLock: (isLocked: boolean) => void
  onRestoreStep: (id: string) => void
  onRestoreAll: () => void
  onEmptyTrash: () => void
}

export const StepToolbar = ({
  isDisabled = false,
  canUndo,
  canRedo,
  stepCount,
  isAllCollapsed,
  isLocked,
  trash,
  onUndo,
  onRedo,
  onToggleAll,
  onToggleLock,
  onRestoreStep,
  onRestoreAll,
  onEmptyTrash,
}: StepToolbarProps) => (
  <HeaderActions>
    <div role="group" aria-label="Course actions" className="step-toolbar">
      <IconToggleButton
        label="Lock Editing"
        className="step-toolbar-lock"
        isSelected={isLocked}
        isDisabled={isDisabled}
        onChange={onToggleLock}
      >
        {isLocked ? <Lock key="locked" /> : <LockOpen key="open" />}
      </IconToggleButton>
      <IconButton
        label="Undo"
        isDisabled={isDisabled || isLocked || !canUndo}
        onPress={onUndo}
      >
        <Undo2 />
      </IconButton>
      <IconButton
        label="Redo"
        isDisabled={isDisabled || isLocked || !canRedo}
        onPress={onRedo}
      >
        <Redo2 />
      </IconButton>
      <IconButton
        label={isAllCollapsed ? 'Expand All' : 'Collapse All'}
        isDisabled={isDisabled || stepCount === 0}
        onPress={onToggleAll}
      >
        {isAllCollapsed ? <ChevronsUpDown /> : <ChevronsDownUp />}
      </IconButton>
      <DialogTrigger>
        <IconButton
          isDisabled={isDisabled || isLocked}
          label={`Deleted Steps (${trash.length})`}
        >
          <Trash2 />
          {trash.length > 0 && (
            <span className="step-toolbar-badge" aria-hidden="true">
              {trash.length}
            </span>
          )}
        </IconButton>
        <TrashPopover
          trash={trash}
          onRestoreStep={onRestoreStep}
          onRestoreAll={onRestoreAll}
          onEmptyTrash={onEmptyTrash}
        />
      </DialogTrigger>
    </div>
  </HeaderActions>
)
