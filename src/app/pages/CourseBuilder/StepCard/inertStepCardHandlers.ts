import type { StepCardHandlers } from './StepCard'

const ignore = () => undefined

export const inertStepCardHandlers: StepCardHandlers = {
  onToggleCollapsed: ignore,
  onEdit: ignore,
  onDiscard: ignore,
  onChange: ignore,
  onTrash: ignore,
}
