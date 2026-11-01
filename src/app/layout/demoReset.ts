export const demoResetEvent = 'course-builder:reset-demo'

export const requestDemoReset = () =>
  window.dispatchEvent(new Event(demoResetEvent))
