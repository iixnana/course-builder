import {
  composeRenderProps,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'
import './TextField.css'

interface TextFieldProps extends AriaTextFieldProps {
  label: string
  isLabelHidden?: boolean
  isMultiline?: boolean
  placeholder?: string
  errorMessage?: string | null
}

export const TextField = ({
  label,
  isLabelHidden = false,
  isMultiline = false,
  placeholder,
  errorMessage,
  className,
  ...props
}: TextFieldProps) => (
  <AriaTextField
    isInvalid={Boolean(errorMessage)}
    {...props}
    className={composeRenderProps(className, (className) =>
      className ? `text-field ${className}` : 'text-field',
    )}
  >
    <Label
      className={isLabelHidden ? 'screen-reader-only' : 'text-field-label'}
    >
      {label}
    </Label>
    {isMultiline ? (
      <TextArea className="text-field-input" placeholder={placeholder} />
    ) : (
      <Input className="text-field-input" placeholder={placeholder} />
    )}
    <FieldError className="text-field-error">{errorMessage}</FieldError>
  </AriaTextField>
)
