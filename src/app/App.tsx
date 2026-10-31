import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { PageLayout } from './layout/PageLayout'

export default function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
