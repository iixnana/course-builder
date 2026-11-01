import {
  CircleQuestionMark,
  ImageIcon,
  TextAlignStart,
  type LucideIcon,
} from 'lucide-react'
import type { StepType } from '../../../model/course'

const icons: Record<StepType, LucideIcon> = {
  text: TextAlignStart,
  image: ImageIcon,
  multipleChoice: CircleQuestionMark,
}

interface StepTypeIconProps {
  type: StepType
  className?: string
}

export const StepTypeIcon = ({ type, className }: StepTypeIconProps) => {
  const Icon = icons[type]
  return <Icon className={className} aria-hidden="true" focusable="false" />
}
