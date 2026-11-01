import { ImageUp } from 'lucide-react'
import { useState } from 'react'
import {
  DropZone,
  FileTrigger,
  isFileDropItem,
  type DropItem,
} from 'react-aria-components'
import { BlueberryLoader } from '../../../../../components/BlueberryLoader/BlueberryLoader'
import { Button } from '../../../../../components/Button/Button'
import {
  imageTitleFromName,
  type PickedImage,
} from '../../../../../../model/steps/image'
import { compressImage } from '../../../../../../utils/compressImage'
import './UploadPanel.css'

interface UploadPanelProps {
  onPick: (image: PickedImage) => void
}

const maxFileMegabytes = 10
const maxFileSize = maxFileMegabytes * 1024 * 1024

export const UploadPanel = ({ onPick }: UploadPanelProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Pick an image file, like a JPG, PNG, GIF or WebP.')
      return
    }
    if (file.size > maxFileSize) {
      setError(`Pick an image under ${maxFileMegabytes} MB.`)
      return
    }
    setError(null)
    setIsUploading(true)
    try {
      onPick({
        url: await compressImage(file),
        title: imageTitleFromName(file.name),
      })
    } catch {
      setError('That image would not open. Try another one.')
    } finally {
      setIsUploading(false)
    }
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
        aria-busy={isUploading}
        isDisabled={isUploading}
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
          Any image up to {maxFileMegabytes} MB. Big photos are resized for you.
        </p>
        {isUploading && (
          <BlueberryLoader label="Uploading the image" isInline />
        )}
      </DropZone>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
