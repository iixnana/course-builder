import { readFileAsDataUrl } from './readFileAsDataUrl'

const maxSide = 1600
const quality = 0.82
const smallEnough = 300 * 1024
const keptAsIs = ['image/gif', 'image/svg+xml']

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

const encode = async (canvas: HTMLCanvasElement, sourceType: string) => {
  const webp = await toBlob(canvas, 'image/webp')
  if (webp?.type === 'image/webp') return webp
  return toBlob(canvas, sourceType === 'image/png' ? 'image/png' : 'image/jpeg')
}

export const compressImage = async (file: File) => {
  if (keptAsIs.includes(file.type)) return readFileAsDataUrl(file)

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= smallEnough) {
    bitmap.close()
    return readFileAsDataUrl(file)
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const compressed = await encode(canvas, file.type)
  const isSmaller = compressed && compressed.size < file.size
  return readFileAsDataUrl(isSmaller ? compressed : file)
}
