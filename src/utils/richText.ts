import TextAlign from '@tiptap/extension-text-align'
import { generateHTML, generateJSON } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const richTextHeadingLevel = 4

export const textAlignments = ['left', 'center', 'right', 'justify'] as const
export type TextAlignment = (typeof textAlignments)[number]

export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [richTextHeadingLevel] },
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    link: false,
    underline: false,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: [...textAlignments],
  }),
]

export const toSafeHtml = (html: string) =>
  generateHTML(generateJSON(html, richTextExtensions), richTextExtensions)

const blockEnd = /<\/(p|h\d|li)>|<br\s*\/?>/gi

export const richTextToPlainText = (html: string) =>
  (
    new DOMParser().parseFromString(html.replace(blockEnd, '$& '), 'text/html')
      .body.textContent ?? ''
  )
    .replace(/\s+/g, ' ')
    .trim()
