import { use, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { HeaderActionsContext } from '../../context/headerActionsContext'

export const HeaderActions = ({ children }: PropsWithChildren) => {
  const slot = use(HeaderActionsContext)
  return slot ? createPortal(children, slot) : null
}
