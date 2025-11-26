"use client"

import { useMemo } from "react"
import toast from "react-hot-toast"

import type { ProductId } from "@/entities/product"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { cn } from "@/shared/lib/utils"

import { removeProduct, makeSelectIsRemoved } from "../../model"

type RemoveButtonProps = {
  /** Product ID to toggle removed status */
  productId: ProductId
  /** Optional additional CSS classes */
  className?: string
}

/**
 * RemoveButton - soft-deletes/restores a product
 * Shows trash icon, uses browser confirm() for MVP
 * Integrates with local-products slice
 *
 * Logic:
 * - Soft-delete: add to removedProductIds (both local and API products)
 * - Already removed: restore by removing from removedProductIds
 */
export function RemoveButton({ productId, className = "" }: RemoveButtonProps) {
  const dispatch = useAppDispatch()

  // Create memoized selector instance for this product
  const selectIsRemoved = useMemo(() => makeSelectIsRemoved(), [])
  const isRemoved = useAppSelector((state) => selectIsRemoved(state, productId))

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking remove button

    // Confirm action with user
    const action = isRemoved ? "restore" : "remove"
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this product?`
    )

    if (confirmed) {
      dispatch(removeProduct(productId))
      if (isRemoved) {
        toast.success("Product restored", {
          position: "bottom-right",
          className: "bg-background text-foreground border border-border",
        })
      } else {
        toast.success("Product removed", {
          position: "bottom-right",
          className: "bg-background text-foreground border border-border",
        })
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group p-2 rounded-full transition-colors hover:bg-accent cursor-pointer",
        className
      )}
      aria-label={isRemoved ? "Restore product" : "Remove product"}
      title={isRemoved ? "Restore product" : "Remove product"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn(
          "w-5 h-5 transition-colors",
          isRemoved
            ? "text-muted-foreground group-hover:text-success"
            : "text-muted-foreground group-hover:text-destructive"
        )}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </button>
  )
}
