import { ImageIcon, ImageUp } from 'lucide-react'
import { DialogTrigger } from 'react-aria-components'
import { Button } from '../../../components/Button/Button'
import { TextField } from '../../../components/TextField/TextField'
import type { ImageStep } from '../../../../model/course'
import { ImagePickerDialog } from './ImagePickerDialog'

interface ImageStepEditorProps {
  step: ImageStep
  onChange: (step: ImageStep) => void
}

export const ImageStepEditor = ({ step, onChange }: ImageStepEditorProps) => (
  <>
    <TextField
      label="Title"
      placeholder="e.g. The pipe alarm"
      value={step.title}
      onChange={(title) => onChange({ ...step, title })}
    />
    {step.url ? (
      <img className="step-image" src={step.url} alt="" />
    ) : (
      <div className="step-image-placeholder">
        <ImageIcon aria-hidden="true" />
        <p>Choose an image to show here.</p>
      </div>
    )}
    <DialogTrigger>
      <Button variant="secondary" className="image-replace-button">
        <ImageUp aria-hidden="true" />
        {step.url ? 'Replace Image' : 'Add Image'}
      </Button>
      <ImagePickerDialog
        title={step.url ? 'Replace image' : 'Add an image'}
        onPick={({ url, title }) =>
          onChange({
            ...step,
            url,
            title: step.title.trim() ? step.title : title,
          })
        }
      />
    </DialogTrigger>
    <TextField
      label="Describe the image for screen readers (optional)"
      placeholder="e.g. An Oompa-Loompa pulling the pipe alarm"
      value={step.alt}
      onChange={(alt) => onChange({ ...step, alt })}
    />
  </>
)
