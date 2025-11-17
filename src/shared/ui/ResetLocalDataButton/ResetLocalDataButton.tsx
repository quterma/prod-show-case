"use client"

import { useState } from "react"

import { resetLocalData, useAppDispatch } from "@/shared/lib/store"

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
    setShowConfirm(false)
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50 transition-colors"
        aria-label="Reset local data"
      >
        Reset Local Data
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Reset Local Data?</h3>
            <p className="text-gray-600 mb-4">
              This will clear all favorites. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
