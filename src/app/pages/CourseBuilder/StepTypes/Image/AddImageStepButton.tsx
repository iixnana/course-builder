import { DialogTrigger } from 'react-aria-components'
import { createImageStep } from '../../../../../model/steps/image'
import { AddStepButton } from '../../AddStep/AddStepButton'
import type { AddStepProps } from '../StepTypeView'
import { ImagePickerDialog } from './ImagePicker/ImagePickerDialog'

export const AddImageStepButton = ({ onAddStep }: AddStepProps) => (
  <DialogTrigger>
    <AddStepButton type="image" />
    <ImagePickerDialog
      title="Add an image"
      onPick={(image) => onAddStep(createImageStep(image))}
    />
  </DialogTrigger>
)
