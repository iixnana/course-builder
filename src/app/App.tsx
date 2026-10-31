import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { PageLayout } from './layout/PageLayout'
import { ErrorPage } from './pages/Errors/Error.page'

export default function App() {
  return (
    <PageLayout>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Suspense fallback={<p role="status">Loading…</p>}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  )
}
