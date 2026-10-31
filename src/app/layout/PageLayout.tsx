import type { PropsWithChildren } from 'react'
import './PageLayout.css'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="page-layout">
      <h1 className="screen-reader-only">
        Willy Wonka's Training Course Builder
      </h1>
      <div className="page-content">{children}</div>
    </main>
  )
}
