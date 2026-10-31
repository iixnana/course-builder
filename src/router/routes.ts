export const NavigationRoute = {
  Index: '/',
  NotFound: '/404',
} as const

export type NavigationRoute =
  (typeof NavigationRoute)[keyof typeof NavigationRoute]
