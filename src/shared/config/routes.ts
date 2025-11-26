/**
 * Centralized routing configuration
 * Single source of truth for all application routes
 *
 * Usage:
 * - Navigation: <Link href={ROUTES.home}>
 * - Programmatic: router.push(ROUTES.products.list)
 * - Dynamic: ROUTES.products.detail(productId)
 * - Pathname check: pathname === ROUTES.home
 */

export const ROUTES = {
  home: "/",
  products: {
    list: "/products",
    detail: (id: string | number) => `/products/${id}`,
  },
} as const

/**
 * Helper to check if pathname matches a route
 * Useful for active state in navigation
 */
export function isActiveRoute(pathname: string, route: string): boolean {
  return pathname === route
}

/**
 * Helper to check if pathname starts with a route prefix
 * Useful for nested routes (e.g., /products/123 matches /products)
 */
export function isRouteActive(pathname: string, routePrefix: string): boolean {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)
}
