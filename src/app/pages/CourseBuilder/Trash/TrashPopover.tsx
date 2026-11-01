import { ArchiveRestore, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Dialog, Heading, Popover } from 'react-aria-components'
import { Button } from '../../../components/Button/Button'
import { CandyScroll } from '../../../components/CandyScroll/CandyScroll'
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog'
import { IconButton } from '../../../components/IconButton/IconButton'
import { overlayOffset } from '../../../components/overlayOffset'
import type { TrashedStep } from '../../../../model/course'
import { stepSummary, stepTypeLabel } from '../../../../model/step'
import { StepTypeBadge } from '../StepTypes/StepTypeBadge'
import '../../../components/Card/Card.css'
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
      <Heading slot="title" level={2} className="trash-popover-title">
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
                <StepTypeBadge type={step.type} />
                <span className="trash-item-title">
                  <span className="screen-reader-only">
                    {stepTypeLabel(step.type)} step:{' '}
                  </span>
                  {stepSummary(step)}
                </span>
                <IconButton
                  label="Restore"
                  variant="primary"
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
          <Button variant="danger" onPress={() => setIsConfirmOpen(true)}>
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
  <Popover
    className="card trash-popover"
    placement="bottom end"
    offset={overlayOffset}
  >
    <Dialog className="trash-popover-dialog">
      {({ close }) => <TrashPopoverContent {...props} close={close} />}
    </Dialog>
  </Popover>
)
