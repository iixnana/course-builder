import {
  CircleQuestionMark,
  ImageIcon,
  TextAlignStart,
  type LucideIcon,
} from 'lucide-react'
import type { StepType } from '../../../../model/step'

export const stepTypeIcons: Record<StepType, LucideIcon> = {
  text: TextAlignStart,
  image: ImageIcon,
  multipleChoice: CircleQuestionMark,
}
