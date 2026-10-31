import { appName } from '../../appName'
import { Blueberry } from '../../components/Blueberry/Blueberry'
import { ButtonLink } from '../../components/ButtonLink/ButtonLink'
import { Card } from '../../components/Card/Card'
import { NavigationRoute } from '../../../router/routes'
import './ErrorNotice.css'

interface ErrorNoticeProps {
  title: string
  message: string
}

export const ErrorNotice = ({ title, message }: ErrorNoticeProps) => (
  <Card
    as="section"
    className="error-notice"
    aria-labelledby="error-notice-title"
  >
    <Blueberry mood="sad" className="error-notice-icon" />
    <div className="error-notice-body">
      <hgroup className="error-notice-heading">
        <p className="eyebrow">Error</p>
        <h2 id="error-notice-title">{title}</h2>
      </hgroup>
      <p className="error-notice-message">{message}</p>
      <ButtonLink href={NavigationRoute.Index}>Back to {appName}</ButtonLink>
    </div>
  </Card>
)
