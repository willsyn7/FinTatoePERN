/**
 * Application route constants
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  // Add more routes as needed
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]
