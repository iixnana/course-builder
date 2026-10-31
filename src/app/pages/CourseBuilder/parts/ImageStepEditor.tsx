import { Upload, X } from 'lucide-react'
import { useState } from 'react'
import { FileTrigger } from 'react-aria-components'
import { Button } from '../../../components/Button/Button'
import { TextField } from '../../../components/TextField/TextField'
import type { ImageStep } from '../../../model/course'
import { readFileAsDataUrl } from '../../../utils/readFileAsDataUrl'

interface ImageStepEditorProps {
  step: ImageStep
  onChange: (step: ImageStep) => void
}

const maxFileSize = 2 * 1024 * 1024

export const ImageStepEditor = ({ step, onChange }: ImageStepEditorProps) => {
  const [error, setError] = useState<string | null>(null)
  const isUploaded = step.url.startsWith('data:')

  const uploadImage = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (file.size > maxFileSize) {
      setError('That image is over 2 MB. Pick a smaller one.')
      return
    }
    setError(null)
    onChange({ ...step, url: await readFileAsDataUrl(file) })
  }

  return (
    <>
      {step.url && <img className="step-image" src={step.url} alt="" />}
      <FileTrigger
        acceptedFileTypes={['image/*']}
        onSelect={(files) => void uploadImage(files)}
      >
        <Button variant="secondary" autoFocus>
          <Upload aria-hidden="true" />
          {step.url ? 'Replace image' : 'Upload image'}
        </Button>
      </FileTrigger>
      {error && (
        <p className="step-editor-error" role="alert">
          {error}
        </p>
      )}
      <TextField
        label="Or paste an image link"
        type="url"
        placeholder="https://"
        value={isUploaded ? '' : step.url}
        onChange={(url) => onChange({ ...step, url })}
      />
      <TextField
        label="Describe the image for screen readers"
        placeholder="e.g. An Oompa-Loompa pulling the pipe alarm"
        value={step.alt}
        onChange={(alt) => onChange({ ...step, alt })}
      />
      {step.url && (
        <Button
          variant="secondary"
          onPress={() => onChange({ ...step, url: '' })}
        >
          <X aria-hidden="true" />
          Remove image
        </Button>
      )}
    </>
  )
}
