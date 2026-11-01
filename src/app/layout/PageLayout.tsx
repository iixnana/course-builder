import type { PropsWithChildren } from 'react'
import './PageLayout.css'
import { ScrollProgress } from './ScrollProgress'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="page-layout">
      <SiteHeader />
      <main className="content-column page-content">{children}</main>
      <SiteFooter />
      <ScrollProgress />
    </div>
  )
}
