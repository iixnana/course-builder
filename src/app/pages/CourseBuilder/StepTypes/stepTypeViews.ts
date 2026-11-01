import type { Step, StepOf, StepType } from '../../../../model/step'
import { imageStepView } from './Image/imageStepView'
import { questionStepView } from './Question/questionStepView'
import type { StepTypeView } from './StepTypeView'
import { textStepView } from './Text/textStepView'

export const stepTypeViews: { [T in StepType]: StepTypeView<StepOf<T>> } = {
  text: textStepView,
  image: imageStepView,
  multipleChoice: questionStepView,
}

export const stepViewOf = (step: Step) =>
  stepTypeViews[step.type] as StepTypeView<Step>
