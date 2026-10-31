import {
  Dialog,
  Heading,
  ModalOverlay,
  Modal as AriaModal,
  type DialogProps,
} from 'react-aria-components'
import './Modal.css'

interface ModalProps {
  title: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  role?: DialogProps['role']
  children: DialogProps['children']
}

export const Modal = ({
  title,
  isOpen,
  onOpenChange,
  role = 'dialog',
  children,
}: ModalProps) => (
  <ModalOverlay
    className="modal-overlay"
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    isDismissable={role === 'dialog'}
  >
    <AriaModal className="modal">
      <Dialog className="modal-dialog" role={role}>
        {(renderProps) => (
          <>
            <Heading slot="title" level={2} className="modal-title">
              {title}
            </Heading>
            {typeof children === 'function' ? children(renderProps) : children}
          </>
        )}
      </Dialog>
    </AriaModal>
  </ModalOverlay>
)
