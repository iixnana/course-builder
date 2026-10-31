import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { BlueberryLoader } from './components/BlueberryLoader/BlueberryLoader'
import { PageLayout } from './layout/PageLayout'
import { ErrorPage } from './pages/Errors/Error.page'

export default function App() {
  return (
    <PageLayout>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Suspense fallback={<BlueberryLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  )
}
