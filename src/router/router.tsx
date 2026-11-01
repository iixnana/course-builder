import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NavigationRoute } from './routes'
import { App } from '../app/App'
import { CourseBuilderPage } from '../app/pages/CourseBuilder/CourseBuilder.page'
import { ErrorPage } from '../app/pages/Errors/Error.page'
import { NotFoundPage } from '../app/pages/Errors/NotFound.page'

export const router = createBrowserRouter([
  {
    path: NavigationRoute.Index,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <CourseBuilderPage /> },
          { path: NavigationRoute.NotFound, element: <NotFoundPage /> },
          {
            path: '*',
            element: <Navigate to={NavigationRoute.NotFound} replace />,
          },
        ],
      },
    ],
  },
])
