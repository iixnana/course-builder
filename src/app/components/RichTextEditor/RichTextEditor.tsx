import { Placeholder } from '@tiptap/extensions'
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignJustify,
  AlignRight,
  Bold,
  Heading,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react'
import {
  richTextExtensions,
  textAlignments,
  richTextHeadingLevel,
  type TextAlignment,
} from '../../../utils/richText'
import { IconToggleButton } from '../IconButton/IconToggleButton'
import './RichTextEditor.css'

interface RichTextEditorProps {
  label: string
  value: string
  placeholder?: string
  onChange: (html: string) => void
}

interface FormattingToolbarProps {
  editor: Editor
  isEditing: boolean
  label: string
}

interface FormatButtonProps {
  label: string
  icon: ReactNode
  isSelected: boolean
  onToggle: () => void
}

const heading = { level: richTextHeadingLevel } as const

const alignmentOptions: {
  id: TextAlignment
  label: string
  icon: ReactNode
}[] = [
  { id: 'left', label: 'Align Left', icon: <AlignLeft /> },
  { id: 'center', label: 'Align Centre', icon: <AlignCenter /> },
  { id: 'right', label: 'Align Right', icon: <AlignRight /> },
  { id: 'justify', label: 'Justify', icon: <AlignJustify /> },
]

const alignmentOf = (editor: Editor): TextAlignment =>
  textAlignments.find(
    (alignment) =>
      alignment !== 'left' && editor.isActive({ textAlign: alignment }),
  ) ?? 'left'

const htmlOf = (editor: Editor) => (editor.isEmpty ? '' : editor.getHTML())

const FormatButton = ({
  label,
  icon,
  isSelected,
  onToggle,
}: FormatButtonProps) => (
  <IconToggleButton
    label={label}
    className="rich-text-editor-button"
    isSelected={isSelected}
    onChange={onToggle}
  >
    {icon}
  </IconToggleButton>
)

const FormattingToolbar = ({
  editor,
  isEditing,
  label,
}: FormattingToolbarProps) => {
  const formats = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      alignment: alignmentOf(editor),
      heading: editor.isActive('heading', heading),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
    }),
  })
  const isActive = (format: Exclude<keyof typeof formats, 'alignment'>) =>
    isEditing && formats[format]
  const chain = () => editor.chain().focus()

  return (
    <div role="group" aria-label={label} className="rich-text-editor-toolbar">
      <div className="rich-text-editor-group">
        <FormatButton
          label="Bold"
          icon={<Bold />}
          isSelected={isActive('bold')}
          onToggle={() => chain().toggleBold().run()}
        />
        <FormatButton
          label="Italic"
          icon={<Italic />}
          isSelected={isActive('italic')}
          onToggle={() => chain().toggleItalic().run()}
        />
        <FormatButton
          label="Strikethrough"
          icon={<Strikethrough />}
          isSelected={isActive('strike')}
          onToggle={() => chain().toggleStrike().run()}
        />
      </div>
      <div className="rich-text-editor-group">
        <FormatButton
          label="Heading"
          icon={<Heading />}
          isSelected={isActive('heading')}
          onToggle={() => chain().toggleHeading(heading).run()}
        />
        <FormatButton
          label="Bulleted List"
          icon={<List />}
          isSelected={isActive('bulletList')}
          onToggle={() => chain().toggleBulletList().run()}
        />
        <FormatButton
          label="Numbered List"
          icon={<ListOrdered />}
          isSelected={isActive('orderedList')}
          onToggle={() => chain().toggleOrderedList().run()}
        />
      </div>
      <div className="rich-text-editor-group">
        {alignmentOptions.map((alignment) => (
          <FormatButton
            key={alignment.id}
            label={alignment.label}
            icon={alignment.icon}
            isSelected={isEditing && formats.alignment === alignment.id}
            onToggle={() => chain().setTextAlign(alignment.id).run()}
          />
        ))}
      </div>
    </div>
  )
}

export const RichTextEditor = ({
  label,
  value,
  placeholder,
  onChange,
}: RichTextEditorProps) => {
  const labelId = useId()
  const [isEditing, setIsEditing] = useState(false)
  const latestOnChange = useRef(onChange)

  useLayoutEffect(() => {
    latestOnChange.current = onChange
  }, [onChange])

  const editor = useEditor({
    extensions: [...richTextExtensions, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate: ({ editor }) => latestOnChange.current(htmlOf(editor)),
    editorProps: {
      attributes: {
        class: 'rich-text-content rich-text-editor-input',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': labelId,
      },
    },
  })

  useEffect(() => {
    if (editor.isDestroyed || htmlOf(editor) === value) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  return (
    <div className="rich-text-editor">
      <span
        id={labelId}
        className="field-label"
        onClick={() => editor.commands.focus()}
      >
        {label}
      </span>
      <div
        className="rich-text-editor-frame"
        onFocus={() => setIsEditing(true)}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsEditing(false)
          }
        }}
      >
        <EditorContent editor={editor} />
        <FormattingToolbar
          editor={editor}
          isEditing={isEditing}
          label={`${label} formatting`}
        />
      </div>
    </div>
  )
}
