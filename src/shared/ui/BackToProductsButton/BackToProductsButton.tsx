"use client"

import { useRouter } from "next/navigation"

import { Button } from "../Button"

/**
 * Reusable button component that navigates back to the products list page
 * Encapsulates routing logic and provides consistent "Back to Products" action
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
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/products")}>Back to Products</Button>
  )
}
