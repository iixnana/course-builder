const prefetchDelayMs = import.meta.env.DEV ? 5000 : 0
const prefetchedKey = 'course-builder:prefetched'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const simulatePrefetch = async () => {
  if (prefetchDelayMs === 0 || sessionStorage.getItem(prefetchedKey)) return
  await wait(prefetchDelayMs)
  sessionStorage.setItem(prefetchedKey, 'true')
}
