import { ImageIcon } from 'lucide-react'
import type { ImageStep } from '../../../../../model/steps/image'
import type { StepPreviewProps } from '../StepTypeView'
import './ImageStep.css'

export const ImageStepPreview = ({ step }: StepPreviewProps<ImageStep>) =>
  step.url ? (
    <figure className="step-figure">
      <img className="step-image" src={step.url} alt={step.alt} />
      {step.alt.trim() && (
        <figcaption className="step-image-caption" aria-hidden="true">
          {step.alt}
        </figcaption>
      )}
    </figure>
  ) : (
    <div className="step-image-placeholder">
      <ImageIcon aria-hidden="true" />
      <p>Edit this step to add an image.</p>
    </div>
  )
