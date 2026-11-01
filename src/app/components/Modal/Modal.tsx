import { X } from 'lucide-react'
import {
  Dialog,
  Heading,
  ModalOverlay,
  Modal as AriaModal,
  type DialogProps,
} from 'react-aria-components'
import { IconButton } from '../IconButton/IconButton'
import '../Card/Card.css'
import './Modal.css'

interface ModalProps {
  title: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  role?: DialogProps['role']
  hasCloseButton?: boolean
  children: DialogProps['children']
}

export const Modal = ({
  title,
  isOpen,
  onOpenChange,
  role = 'dialog',
  hasCloseButton = false,
  children,
}: ModalProps) => (
  <ModalOverlay
    className="modal-overlay"
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    isDismissable={role === 'dialog'}
  >
    <AriaModal className="card modal">
      <Dialog className="modal-dialog" role={role}>
        {(renderProps) => (
          <>
            <div className="modal-header">
              <Heading slot="title" level={2} className="modal-title">
                {title}
              </Heading>
              {hasCloseButton && (
                <IconButton label="Close" onPress={renderProps.close}>
                  <X />
                </IconButton>
              )}
            </div>
            {typeof children === 'function' ? children(renderProps) : children}
          </>
        )}
      </Dialog>
    </AriaModal>
  </ModalOverlay>
)
