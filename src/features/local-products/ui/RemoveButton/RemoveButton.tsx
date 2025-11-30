"use client"

import { useState } from "react"
import toast from "react-hot-toast"

import type { ProductId } from "@/entities/product"
import { useAppDispatch } from "@/shared/lib/store"
import { cn } from "@/shared/lib/utils"
import { ConfirmationModal } from "@/shared/ui"

import { removeProduct } from "../../model"

type RemoveButtonProps = {
  /** Product ID to remove */
  productId: ProductId
  /** Optional additional CSS classes */
  className?: string
}

/**
 * RemoveButton - soft-deletes a product
 * Shows trash icon with confirmation modal
 * Integrates with local-products slice
 */
export function RemoveButton({ productId, className = "" }: RemoveButtonProps) {
  const dispatch = useAppDispatch()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking remove button
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    dispatch(removeProduct(productId))
    toast.success("Product removed", {
      position: "bottom-right",
      className: "bg-background text-foreground border border-border",
    })
    setShowConfirm(false)
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          "group p-2 rounded-full transition-colors hover:bg-accent cursor-pointer",
          className
        )}
        aria-label="Remove product"
        title="Remove product"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-destructive"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>

      <ConfirmationModal
        open={showConfirm}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Remove Product?"
        description="Are you sure you want to remove this product? It will be hidden from the list."
        confirmText="Remove"
        variant="destructive"
      />
    </>
  )
}
