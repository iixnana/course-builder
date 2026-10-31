import type { PropsWithChildren } from 'react'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <h1 className="screen-reader-only">
        Willy Wonka's Training Course Builder
      </h1>
      {children}
    </main>
  )
}
