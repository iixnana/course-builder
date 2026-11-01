interface SpringConfig {
  stiffness: number
  damping: number
  mass?: number
}

const restThreshold = 0.001

export const createSpring = ({
  stiffness,
  damping,
  mass = 1,
}: SpringConfig) => {
  let value = 0
  let target = 0
  let velocity = 0

  return {
    setTarget: (next: number) => {
      target = next
    },
    getValue: () => value,
    tick: (seconds: number) => {
      const acceleration =
        (-stiffness * (value - target) - damping * velocity) / mass
      velocity += acceleration * seconds
      value += velocity * seconds
      if (
        Math.abs(value - target) < restThreshold &&
        Math.abs(velocity) < restThreshold
      ) {
        value = target
        velocity = 0
      }
    },
  }
}

export const springKeyframes = (
  from: number,
  to: number,
  steps: number,
  { stiffness, damping, mass = 1 }: SpringConfig,
  durationSeconds: number,
) => {
  const naturalFrequency = Math.sqrt(stiffness / mass)
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
  const dampedFrequency =
    naturalFrequency * Math.sqrt(Math.max(1 - dampingRatio * dampingRatio, 0))

  return Array.from({ length: steps + 1 }, (_, index) => {
    const time = (index / steps) * durationSeconds
    const envelope = Math.exp(-dampingRatio * naturalFrequency * time)
    const oscillation =
      dampedFrequency === 0
        ? envelope
        : envelope *
          (Math.cos(dampedFrequency * time) +
            ((dampingRatio * naturalFrequency) / dampedFrequency) *
              Math.sin(dampedFrequency * time))
    return to - (to - from) * oscillation
  })
}
