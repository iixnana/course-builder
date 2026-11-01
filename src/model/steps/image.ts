import type { StepDefinition } from './stepDefinition'

export interface ImageStep {
  id: string
  type: 'image'
  title: string
  url: string
  alt: string
}

export interface PickedImage {
  url: string
  title: string
}

const defaultImageTitle = 'New image'

export const createImageStep = ({ url, title }: PickedImage): ImageStep => ({
  id: crypto.randomUUID(),
  type: 'image',
  title,
  url,
  alt: '',
})

const looksLikeWords = (name: string) =>
  /\p{L}{2}/u.test(name) && !/\d{5}/.test(name)

const isHash = (word: string) =>
  word.length >= 6 && /\d/.test(word) && /\p{L}/u.test(word)

export const imageTitleFromName = (fileName: string) => {
  const name = fileName
    .replace(/\.[a-z0-9]+$/i, '')
    .split(/[-_.+\s]+/)
    .filter((word) => word && !isHash(word))
    .join(' ')
  if (!looksLikeWords(name)) return defaultImageTitle
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const imageStep: StepDefinition<ImageStep> = {
  label: 'Image',
  summary: (step) => step.title.trim() || 'Name your image',
  isUntouched: () => false,
}
