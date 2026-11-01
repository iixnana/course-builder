import { useMemo } from 'react'
import { toSafeHtml } from '../../../utils/richText'
import './RichTextEditor.css'

interface RichTextProps {
  html: string
}

export const RichText = ({ html }: RichTextProps) => {
  const safeHtml = useMemo(() => toSafeHtml(html), [html])

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
