import {
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps,
} from 'react-aria-components'

const openDelay = 600

export const TooltipTrigger = (props: TooltipTriggerComponentProps) => (
  <AriaTooltipTrigger delay={openDelay} closeDelay={0} {...props} />
)
