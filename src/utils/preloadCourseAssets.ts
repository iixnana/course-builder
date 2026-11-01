import type { Course } from '../model/course'

const maxWait = 5000

const preloadImage = (url: string) => {
  const image = new Image()
  image.src = url
  return image.decode()
}

export const preloadCourseAssets = async (course: Course) => {
  const imageUrls = course.steps.flatMap((step) =>
    step.type === 'image' && step.url ? [step.url] : [],
  )
  await Promise.race([
    Promise.allSettled([document.fonts.ready, ...imageUrls.map(preloadImage)]),
    new Promise((resolve) => setTimeout(resolve, maxWait)),
  ])
}
