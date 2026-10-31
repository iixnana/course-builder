import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  isOpen,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) => (
  <Modal
    title={title}
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    role="alertdialog"
  >
    {({ close }) => (
      <>
        <p>{message}</p>
        <div className="modal-actions">
          <Button variant="secondary" onPress={close} autoFocus>
            Cancel
          </Button>
          <Button
            variant="danger"
            onPress={() => {
              onConfirm()
              close()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </>
    )}
  </Modal>
)
