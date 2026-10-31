import type { PropsWithChildren } from 'react'
import './PageLayout.css'
import { SiteHeader } from './SiteHeader'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="page-layout">
      <SiteHeader />
      <main className="content-column page-content">{children}</main>
    </div>
  )
}
