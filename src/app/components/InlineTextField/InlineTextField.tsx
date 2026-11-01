import type { KeyboardEvent } from 'react'
import {
  composeRenderProps,
  Input,
  Label,
  TextArea,
  TextField,
  type TextFieldProps,
} from 'react-aria-components'
import { classNames } from '../../../utils/classNames'
import './InlineTextField.css'

interface InlineTextFieldProps extends TextFieldProps {
  label: string
  placeholder?: string
  isWrapping?: boolean
}

const toSingleLine = (value: string) => value.replace(/\s*\n+\s*/g, ' ')

const preventNewLine = (event: KeyboardEvent) => {
  if (event.key === 'Enter') event.preventDefault()
}

export const InlineTextField = ({
  label,
  placeholder,
  isWrapping = false,
  className,
  onChange,
  ...props
}: InlineTextFieldProps) => (
  <TextField
    {...props}
    onChange={(value) => onChange?.(isWrapping ? toSingleLine(value) : value)}
    className={composeRenderProps(className, (className) =>
      classNames('inline-text-field', className),
    )}
  >
    <Label className="eyebrow inline-text-field-label">{label}</Label>
    {isWrapping ? (
      <TextArea
        className="inline-text-field-input"
        placeholder={placeholder}
        rows={1}
        onKeyDown={preventNewLine}
      />
    ) : (
      <Input className="inline-text-field-input" placeholder={placeholder} />
    )}
  </TextField>
)
