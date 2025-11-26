"use client"

import { useState } from "react"
import toast from "react-hot-toast"

import { resetLocalData, useAppDispatch } from "@/shared/lib/store"
import { Button, ConfirmationModal } from "@/shared/ui"

/**
 * ResetLocalDataButton - infrastructure UI component for clearing all local data
 *
 * Provides a button with confirmation modal to reset:
 * - Favorites
 * - Local products
 * - Filters
 * - RTK Query cache
 *
 * Lives in shared/ui because it's an infrastructure utility component,
 * not business logic specific to any feature.
 */
export function ResetLocalDataButton() {
  const dispatch = useAppDispatch()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    dispatch(resetLocalData())
    toast.success("Local data cleared", {
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
      <Button
        onClick={handleClick}
        variant="destructive"
        className="whitespace-nowrap"
        aria-label="Reset local data"
      >
        Reset Local Data
      </Button>

      <ConfirmationModal
        open={showConfirm}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Reset Local Data?"
        description="This will clear all favorites, local products, and filters. This action cannot be undone."
        confirmText="Reset"
        variant="destructive"
      />
    </>
  )
}
