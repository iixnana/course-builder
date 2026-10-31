import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NavigationRoute } from './routes'
import App from '../app/App'

export const router = createBrowserRouter([
  {
    path: NavigationRoute.Index,
    element: <App />,
    children: [
      {
        path: NavigationRoute.NotFound,
        element: <div>404 Not Found</div>,
      },
      { path: '*', element: <Navigate to={NavigationRoute.NotFound} /> },
    ],
  },
])
