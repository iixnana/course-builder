import { Link } from 'react-router-dom'
import { NavigationRoute } from '../../../router/routes'

interface ErrorNoticeProps {
  title: string
  message: string
}

export const ErrorNotice = ({ title, message }: ErrorNoticeProps) => (
  <section aria-labelledby="error-notice-title">
    <h2 id="error-notice-title">{title}</h2>
    <p>{message}</p>
    <Link to={NavigationRoute.Index}>Back to the Course Builder</Link>
  </section>
)
