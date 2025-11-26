"use client"

import Link from "next/link"

import { ROUTES } from "@/shared/config"

/**
 * Reusable button component that navigates back to the products list page
 * Encapsulates routing logic and provides consistent "Back to Products" action
 *
 * Styled as a button but semantically a link (no nested button element)
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="Product not found"
 *   action={<BackToProductsButton />}
 * />
 * ```
 */
export function BackToProductsButton() {
  return (
    <Link
      href={ROUTES.products.list}
      className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors duration-150"
    >
      Back to Products
    </Link>
  )
}
