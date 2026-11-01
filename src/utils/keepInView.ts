const settledFrames = 8
const maxDuration = 2000

const userScrollEvents = ['wheel', 'touchstart', 'keydown'] as const

let activeRun = 0

export const keepInView = (element: Element | null | undefined) => {
  if (!element) return
  const root = document.documentElement
  const startTop = element.getBoundingClientRect().top
  const startTime = performance.now()
  let hasMoved = false
  let stillFrames = 0
  let isReleased = false
  activeRun += 1
  const run = activeRun

  const release = () => {
    isReleased = true
  }

  const finish = () => {
    if (run === activeRun) root.style.removeProperty('overflow-anchor')
    for (const type of userScrollEvents) {
      window.removeEventListener(type, release)
    }
  }

  root.style.overflowAnchor = 'none'

  const tick = () => {
    if (isReleased || run !== activeRun) {
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

  requestAnimationFrame(() => {
    for (const type of userScrollEvents) {
      window.addEventListener(type, release, { passive: true })
    }
    tick()
  })
}

export const firstOnScreen = (elements: Iterable<Element>) => {
  const list = [...elements]
  return (
    list.find((element) => element.getBoundingClientRect().top >= 0) ??
    list.find((element) => element.getBoundingClientRect().bottom > 0)
  )
}
