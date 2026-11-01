import { useMemo } from 'react'
import { RichText } from '../../../../components/RichTextEditor/RichText'
import type { TextStep } from '../../../../../model/steps/text'
import { richTextToPlainText } from '../../../../../utils/richText'
import type { StepPreviewProps } from '../StepTypeView'

export const TextStepPreview = ({ step }: StepPreviewProps<TextStep>) => {
  const hasText = useMemo(
    () => richTextToPlainText(step.body) !== '',
    [step.body],
  )
  return hasText ? (
    <RichText html={step.body} />
  ) : (
    <p className="placeholder-text">Edit this step to add your text.</p>
  )
}
