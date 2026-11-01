import { Suspense } from 'react'
import { RouterProvider } from 'react-aria-components'
import { Outlet, useHref, useNavigate } from 'react-router-dom'
import { BlueberryLoader } from './components/BlueberryLoader/BlueberryLoader'
import { PageLayout } from './layout/PageLayout'

export const App = () => {
  const navigate = useNavigate()

  return (
    <RouterProvider navigate={(path) => void navigate(path)} useHref={useHref}>
      <PageLayout>
        <Suspense fallback={<BlueberryLoader />}>
          <Outlet />
        </Suspense>
      </PageLayout>
    </RouterProvider>
  )
}
