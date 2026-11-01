import { ImageUp, Link } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import {
  DropZone,
  FileTrigger,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  isFileDropItem,
  type DropItem,
} from 'react-aria-components'
import { Button } from '../../../components/Button/Button'
import { Modal } from '../../../components/Modal/Modal'
import { TextField } from '../../../components/TextField/TextField'
import { imageTitleFromName, type PickedImage } from '../../../../model/course'
import { compressImage } from '../../../../utils/compressImage'
import './ImagePickerDialog.css'

interface ImagePickerDialogProps {
  title: string
  onPick: (image: PickedImage) => void
}

interface ImagePickerProps {
  onPick: (image: PickedImage) => void
}

type LinkStatus = 'idle' | 'loading' | 'ready' | 'broken'

const maxFileSize = 10 * 1024 * 1024

const isWebLink = (text: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(text).protocol)
  } catch {
    return false
  }
}

const fileNameFromLink = (link: string) =>
  decodeURIComponent(new URL(link).pathname.split('/').at(-1) ?? '')

const UploadPanel = ({ onPick }: Pick<ImagePickerProps, 'onPick'>) => {
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Pick an image file, like a JPG, PNG, GIF or WebP.')
      return
    }
    if (file.size > maxFileSize) {
      setError('Pick an image under 10 MB.')
      return
    }
    setError(null)
    onPick({
      url: await compressImage(file),
      title: imageTitleFromName(file.name),
    })
  }

  const dropFile = async (items: DropItem[]) => {
    const item = items.find(isFileDropItem)
    await upload(await item?.getFile())
  }

  return (
    <>
      <DropZone
        className="image-drop-zone"
        aria-label="Drop an image here"
        getDropOperation={() => 'copy'}
        onDrop={(event) => void dropFile(event.items)}
      >
        <ImageUp className="image-drop-zone-icon" aria-hidden="true" />
        <p className="image-drop-zone-text">Drag an image here, or</p>
        <FileTrigger
          acceptedFileTypes={['image/*']}
          onSelect={(files) => void upload(files?.[0])}
        >
          <Button>Choose from Your Device</Button>
        </FileTrigger>
        <p className="image-picker-hint">
          Any image up to 10 MB. Big photos are resized for you.
        </p>
      </DropZone>
      {error && (
        <p className="image-picker-error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}

const LinkPanel = ({ onPick }: Pick<ImagePickerProps, 'onPick'>) => {
  const [link, setLink] = useState('')
  const [status, setStatus] = useState<LinkStatus>('idle')
  const trimmed = link.trim()
  const isValid = isWebLink(trimmed)

  const submit = (event: FormEvent) => {
    event.preventDefault()
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
        onChange={(value) => {
          setLink(value)
          setStatus(isWebLink(value.trim()) ? 'loading' : 'idle')
        }}
      />
      <div className="image-link-preview" data-status={status}>
        {isValid ? (
          <img
            key={trimmed}
            src={trimmed}
            alt=""
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('broken')}
          />
        ) : null}
      </div>
      <p className="image-picker-hint" role="status">
        {trimmed && !isValid && 'Paste a link that starts with https://'}
        {status === 'loading' && 'Loading the image…'}
        {status === 'broken' &&
          'Check that the link goes straight to an image, then try again.'}
      </p>
      <Button type="submit" isDisabled={status !== 'ready'}>
        Add
      </Button>
    </form>
  )
}

const ImagePicker = ({ onPick }: ImagePickerProps) => (
  <>
    <Tabs className="image-picker-tabs">
      <TabList
        aria-label="Where's the image from?"
        className="image-picker-tab-list"
      >
        <Tab id="upload" className="image-picker-tab">
          <ImageUp aria-hidden="true" />
          Upload
        </Tab>
        <Tab id="link" className="image-picker-tab">
          <Link aria-hidden="true" />
          Link
        </Tab>
      </TabList>
      <TabPanel
        id="upload"
        className="image-picker-panel image-picker-upload"
        shouldForceMount
      >
        <UploadPanel onPick={onPick} />
      </TabPanel>
      <TabPanel id="link" className="image-picker-panel" shouldForceMount>
        <LinkPanel onPick={onPick} />
      </TabPanel>
    </Tabs>
  </>
)

export const ImagePickerDialog = ({
  title,
  onPick,
}: ImagePickerDialogProps) => (
  <Modal title={title} hasCloseButton>
    {({ close }) => (
      <ImagePicker
        onPick={(image) => {
          onPick(image)
          close()
        }}
      />
    )}
  </Modal>
)
