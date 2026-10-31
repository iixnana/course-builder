const nonTextInputTypes = ['button', 'checkbox', 'radio', 'file', 'submit']

export const isTextEntry = (target: EventTarget | null) =>
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLInputElement &&
    !nonTextInputTypes.includes(target.type))
