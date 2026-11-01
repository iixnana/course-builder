import { useState, type PropsWithChildren } from 'react'
import { HeaderActionsContext } from '../../context/headerActionsContext'
import './PageLayout.css'
import { ScrollProgress } from './ScrollProgress'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export const PageLayout = ({ children }: PropsWithChildren) => {
  const [headerActions, setHeaderActions] = useState<HTMLElement | null>(null)

  return (
    <div className="page-layout">
      <SiteHeader actionsRef={setHeaderActions} />
      <HeaderActionsContext value={headerActions}>
        <main className="content-column page-content">{children}</main>
      </HeaderActionsContext>
      <SiteFooter />
      <ScrollProgress />
    </div>
  )
}
