import { ArchiveRestore } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/Button/Button'
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog'
import { Modal } from '../../../components/Modal/Modal'
import { StepTypeIcon } from '../../../components/StepTypeIcon/StepTypeIcon'
import {
  stepSummary,
  stepTypeLabel,
  type TrashedStep,
} from '../../../model/course'
import './TrashDialog.css'

interface TrashDialogProps {
  trash: TrashedStep[]
  onRestoreStep: (id: string) => void
  onEmptyTrash: () => void
}

const stepCount = (count: number) => (count === 1 ? '1 step' : `${count} steps`)

export const TrashDialog = ({
  trash,
  onRestoreStep,
  onEmptyTrash,
}: TrashDialogProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  return (
    <Modal title="Trash">
      {({ close }) => (
        <>
          {trash.length === 0 ? (
            <p>The trash is empty. Steps you delete will wait here.</p>
          ) : (
            <ul className="trash-list" aria-label="Deleted steps">
              {trash.map(({ step }) => (
                <li key={step.id} className="trash-item">
                  <StepTypeIcon type={step.type} className="trash-item-icon" />
                  <span className="trash-item-title">
                    <span className="screen-reader-only">
                      {stepTypeLabel[step.type]} step:{' '}
                    </span>
                    {stepSummary(step)}
                  </span>
                  <Button
                    variant="secondary"
                    onPress={() => onRestoreStep(step.id)}
                  >
                    <ArchiveRestore aria-hidden="true" />
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="modal-actions">
            <Button
              variant="danger"
              isDisabled={trash.length === 0}
              onPress={() => setIsConfirmOpen(true)}
            >
              Empty trash
            </Button>
            <Button variant="secondary" onPress={close}>
              Close
            </Button>
          </div>
          <ConfirmDialog
            title="Empty the trash?"
            message={`This permanently deletes ${stepCount(trash.length)}. It can't be undone.`}
            confirmLabel="Delete forever"
            isOpen={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            onConfirm={onEmptyTrash}
          />
        </>
      )}
    </Modal>
  )
}
