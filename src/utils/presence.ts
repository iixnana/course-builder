const readMotionToken = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const toMilliseconds = (time: string) =>
  Number.parseFloat(time) * (time.endsWith('ms') ? 1 : 1000)

export const motion = () => ({
  duration: toMilliseconds(readMotionToken('--motion-duration')),
  easing: readMotionToken('--motion-easing'),
})

const hiddenScale = '0.85'

const enterKeyframes = (element: HTMLElement, easing: string): Keyframe[] => {
  const parent = element.parentElement
  const gap =
    parent && parent.children.length > 1
      ? getComputedStyle(parent).rowGap
      : '0px'
  const collapsed = `calc(-1 * (${element.offsetHeight}px + ${gap}))`

  return [
    { offset: 0, marginTop: collapsed, opacity: 0, scale: hiddenScale, easing },
    { offset: 0.4, opacity: 0, scale: hiddenScale, easing },
    { offset: 0.6, marginTop: '0px', easing },
    { offset: 1, marginTop: '0px', opacity: 1, scale: '1' },
  ]
}

const mirror = (keyframes: Keyframe[], easing: string): Keyframe[] =>
  keyframes
    .map(({ offset, ...frame }) => ({
      ...frame,
      offset: 1 - Number(offset),
      easing,
    }))
    .toReversed()

export const animatePresence = (
  element: HTMLElement,
  direction: 'enter' | 'exit',
) => {
  const { duration, easing } = motion()
  const keyframes = enterKeyframes(element, easing)
  return element.animate(
    direction === 'enter' ? keyframes : mirror(keyframes, easing),
    {
      duration: duration * 1.5,
      easing: 'linear',
      fill: direction === 'exit' ? 'forwards' : 'none',
    },
  ).finished
}
