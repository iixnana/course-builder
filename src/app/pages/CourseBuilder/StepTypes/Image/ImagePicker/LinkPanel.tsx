import { useRef, useState, type FormEvent } from 'react'
import { BlueberryLoader } from '../../../../../components/BlueberryLoader/BlueberryLoader'
import { Button } from '../../../../../components/Button/Button'
import { TextField } from '../../../../../components/TextField/TextField'
import {
  imageTitleFromName,
  type PickedImage,
} from '../../../../../../model/steps/image'
import './LinkPanel.css'

interface LinkPanelProps {
  onPick: (image: PickedImage) => void
}

type LinkStatus = 'idle' | 'loading' | 'ready' | 'broken'

const invalidLinkMessage = 'Paste a link that starts with https://'
const brokenLinkMessage =
  'Check that the link goes straight to an image, then try again.'

const isWebLink = (text: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(text).protocol)
  } catch {
    return false
  }
}

const fileNameFromLink = (link: string) => {
  const name = new URL(link).pathname.split('/').at(-1) ?? ''
  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}

const linkErrorOf = (status: LinkStatus, isValid: boolean) => {
  if (status === 'broken') return brokenLinkMessage
  if (!isValid) return invalidLinkMessage
  return null
}

export const LinkPanel = ({ onPick }: LinkPanelProps) => {
  const [link, setLink] = useState('')
  const [status, setStatus] = useState<LinkStatus>('idle')
  const [isCommitted, setIsCommitted] = useState(false)
  const isPasting = useRef(false)
  const trimmed = link.trim()
  const isValid = isWebLink(trimmed)
  const linkError = isCommitted && trimmed ? linkErrorOf(status, isValid) : null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setIsCommitted(true)
    if (status !== 'ready') return
    onPick({
      url: trimmed,
      title: imageTitleFromName(fileNameFromLink(trimmed)),
    })
  }

  return (
    <form className="image-link-form" onSubmit={submit}>
      <TextField
        label="Image link"
        type="url"
        placeholder="https://"
        value={link}
        errorMessage={linkError}
        onPaste={() => {
          isPasting.current = true
        }}
        onChange={(value) => {
          setLink(value)
          setStatus(isWebLink(value.trim()) ? 'loading' : 'idle')
          setIsCommitted(isPasting.current)
          isPasting.current = false
        }}
        onBlur={() => setIsCommitted(true)}
      />
      <div className="image-link-preview" data-status={status}>
        {isValid && (
          <img
            key={trimmed}
            src={trimmed}
            alt=""
            onLoad={(event) => {
              const image = event.currentTarget
              void image.decode().then(
                () => image.isConnected && setStatus('ready'),
                () => image.isConnected && setStatus('broken'),
              )
            }}
            onError={() => setStatus('broken')}
          />
        )}
        {status === 'loading' && (
          <BlueberryLoader label="Loading the image" isInline />
        )}
      </div>
      <Button type="submit" isDisabled={status !== 'ready'}>
        Add
      </Button>
    </form>
  )
}
