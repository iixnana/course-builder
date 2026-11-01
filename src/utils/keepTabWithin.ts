import type { KeyboardEvent } from 'react'

const tabbable = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]',
].join(', ')

const tabbableIn = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>(tabbable)].filter(
    (element) =>
      element.tabIndex >= 0 &&
      element.getAttribute('aria-disabled') !== 'true' &&
      !element.closest('[inert]') &&
      element.getClientRects().length > 0,
  )

export const keepTabWithin = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key !== 'Tab' || event.defaultPrevented) return
  if (!(event.target instanceof Node)) return
  if (!event.currentTarget.contains(event.target)) return
  const elements = tabbableIn(event.currentTarget)
  if (elements.length === 0) return
  const first = elements[0]
  const last = elements[elements.length - 1]
  const active = document.activeElement
  const isOutside = !elements.some((element) => element === active)
  if (event.shiftKey && (active === first || isOutside)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || isOutside)) {
    event.preventDefault()
    first.focus()
  }
}
