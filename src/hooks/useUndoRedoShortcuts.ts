import { useEffect } from 'react'
import { isTextEntry } from '../utils/isTextEntry'

export const useUndoRedoShortcuts = (
  undo: () => void,
  redo: () => void,
  isEnabled: boolean,
) => {
  useEffect(() => {
    if (!isEnabled) return
    const handleShortcut = (event: KeyboardEvent) => {
      if (isTextEntry(event.target)) return
      if (!(event.metaKey || event.ctrlKey)) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [undo, redo, isEnabled])
}
