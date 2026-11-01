import type { MultipleChoiceStep } from '../../../../../model/steps/multipleChoice'
import type { StepTypeView } from '../StepTypeView'
import { AddQuestionStepButton } from './AddQuestionStepButton'
import { QuestionStepEditor } from './QuestionStepEditor'
import { QuestionStepPreview } from './QuestionStepPreview'

export const questionStepView: StepTypeView<MultipleChoiceStep> = {
  Editor: QuestionStepEditor,
  Preview: QuestionStepPreview,
  AddButton: AddQuestionStepButton,
}
