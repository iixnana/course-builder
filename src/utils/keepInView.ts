const settledFrames = 8
const maxDuration = 2000

const userScrollEvents = ['wheel', 'touchstart', 'keydown'] as const

export const keepInView = (element: Element | null | undefined) => {
  if (!element) return
  const root = document.documentElement
  const startTop = element.getBoundingClientRect().top
  const startTime = performance.now()
  let hasMoved = false
  let stillFrames = 0
  let isReleased = false

  const release = () => {
    isReleased = true
  }

  const finish = () => {
    root.style.removeProperty('overflow-anchor')
    for (const type of userScrollEvents) {
      window.removeEventListener(type, release)
    }
  }

  root.style.overflowAnchor = 'none'
  for (const type of userScrollEvents) {
    window.addEventListener(type, release, { passive: true })
  }

  const tick = () => {
    if (isReleased) {
      finish()
      return
    }
    const delta = element.getBoundingClientRect().top - startTop
    if (delta !== 0) {
      window.scrollBy(0, delta)
      hasMoved = true
      stillFrames = 0
    } else if (hasMoved) {
      stillFrames += 1
    }
    const isSettled = hasMoved && stillFrames >= settledFrames
    if (!isSettled && performance.now() - startTime < maxDuration) {
      requestAnimationFrame(tick)
    } else {
      finish()
    }
  }

  requestAnimationFrame(tick)
}

const stepElements = () => [
  ...document.querySelectorAll<HTMLElement>('[data-step-id]'),
]

export const findStepElement = (id: string) =>
  stepElements().find((element) => element.dataset.stepId === id)

export const findAddStepPanel = () =>
  document.querySelector<HTMLElement>('[data-scroll-anchor="add-step"]')

export const findFirstVisibleStepElement = () => {
  const elements = stepElements()
  return (
    elements.find((element) => element.getBoundingClientRect().top >= 0) ??
    elements.find((element) => element.getBoundingClientRect().bottom > 0)
  )
}
