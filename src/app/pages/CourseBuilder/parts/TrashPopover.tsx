import { ArchiveRestore, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Dialog, Heading, Popover } from 'react-aria-components'
import { Button } from '../../../components/Button/Button'
import { CandyScroll } from '../../../components/CandyScroll/CandyScroll'
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog'
import { IconButton } from '../../../components/IconButton/IconButton'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import {
  stepSummary,
  stepTypeLabel,
  type TrashedStep,
} from '../../../../model/course'
import '../../../components/Card/Card.css'
import './StepCard.css'
import './TrashPopover.css'

interface TrashPopoverProps {
  trash: TrashedStep[]
  onRestoreStep: (id: string) => void
  onRestoreAll: () => void
  onEmptyTrash: () => void
}

interface TrashPopoverContentProps extends TrashPopoverProps {
  close: () => void
}

const stepCount = (count: number) => (count === 1 ? '1 step' : `${count} steps`)

const TrashPopoverContent = ({
  trash,
  close,
  onRestoreStep,
  onRestoreAll,
  onEmptyTrash,
}: TrashPopoverContentProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [closingTrash, setClosingTrash] = useState<TrashedStep[] | null>(null)
  const shownTrash = closingTrash ?? trash

  const actAndClose = (action: () => void) => {
    setClosingTrash(trash)
    action()
    close()
  }

  return (
    <>
      <Heading
        slot="title"
        id="trash-title"
        level={2}
        className="trash-popover-title"
      >
        Deleted Steps
      </Heading>
      {shownTrash.length === 0 ? (
        <p className="trash-popover-empty">
          Spotless! The Oompa-Loompas have licked it clean.
        </p>
      ) : (
        <CandyScroll className="trash-list-scroll">
          <ul className="trash-list" aria-label="Deleted steps">
            {shownTrash.map(({ step }) => (
              <li key={step.id} className="trash-item">
                <span className="step-type-badge">
                  <StepTypeIcon type={step.type} className="step-type-icon" />
                </span>
                <span className="trash-item-title">
                  <span className="screen-reader-only">
                    {stepTypeLabel[step.type]} step:{' '}
                  </span>
                  {stepSummary(step)}
                </span>
                <IconButton
                  label="Restore"
                  className="trash-item-restore"
                  onPress={() => actAndClose(() => onRestoreStep(step.id))}
                >
                  <ArchiveRestore />
                </IconButton>
              </li>
            ))}
          </ul>
        </CandyScroll>
      )}
      {shownTrash.length > 0 && (
        <div className="trash-popover-actions">
          <Button variant="secondary" onPress={() => actAndClose(onRestoreAll)}>
            <ArchiveRestore aria-hidden="true" />
            Restore All
          </Button>
          <Button
            variant="secondary"
            className="trash-popover-delete"
            onPress={() => setIsConfirmOpen(true)}
          >
            <Trash2 aria-hidden="true" />
            Delete All
          </Button>
        </div>
      )}
      <ConfirmDialog
        title={`Delete ${stepCount(shownTrash.length)} for good?`}
        message={
          shownTrash.length === 1
            ? "Once it's gone, not even an Oompa-Loompa can fetch it back."
            : "Once they're gone, not even an Oompa-Loompa can fetch them back."
        }
        confirmLabel="Delete"
        cancelLabel={shownTrash.length === 1 ? 'Keep Step' : 'Keep Steps'}
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => actAndClose(onEmptyTrash)}
      />
    </>
  )
}

export const TrashPopover = (props: TrashPopoverProps) => (
  <Popover className="card trash-popover" placement="bottom end" offset={6}>
    <Dialog className="trash-popover-dialog" aria-labelledby="trash-title">
      {({ close }) => <TrashPopoverContent {...props} close={close} />}
    </Dialog>
  </Popover>
)
