import { ErrorNotice } from './ErrorNotice'

export const NotFoundPage = () => (
  <ErrorNotice
    title="Page not found"
    message="This room isn't on the factory map."
  />
)
