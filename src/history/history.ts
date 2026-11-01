export interface HistoryEntry {
  label: string
  mergeKey?: string
}

interface Snapshot<T> {
  state: T
  entry: HistoryEntry | null
}

export interface History<T> {
  past: Snapshot<T>[]
  present: Snapshot<T>
  future: Snapshot<T>[]
}

const historyLimit = 100

export const createHistory = <T>(state: T): History<T> => ({
  past: [],
  present: { state, entry: null },
  future: [],
})

export const commit = <T>(
  history: History<T>,
  state: T,
  entry: HistoryEntry,
): History<T> => {
  const merges =
    entry.mergeKey !== undefined &&
    history.present.entry?.mergeKey === entry.mergeKey
  return {
    past: merges
      ? history.past
      : [...history.past, history.present].slice(-historyLimit),
    present: { state, entry },
    future: [],
  }
}

export const undo = <T>(history: History<T>): History<T> => {
  const previous = history.past.at(-1)
  if (!previous) return history
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  }
}

export const redo = <T>(history: History<T>): History<T> => {
  const [next, ...future] = history.future
  if (!next) return history
  return {
    past: [...history.past, history.present],
    present: next,
    future,
  }
}

export const forget = <T>(history: History<T>): History<T> =>
  createHistory(history.present.state)

export const undoLabel = <T>(history: History<T>) =>
  history.past.length > 0 ? history.present.entry?.label : undefined

export const redoLabel = <T>(history: History<T>) =>
  history.future[0]?.entry?.label
