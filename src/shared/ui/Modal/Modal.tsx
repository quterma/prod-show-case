"use client"

import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { Button } from "@/shared/ui"

type ModalProps = {
  /** Controls modal visibility */
  open: boolean
  /** Called when modal should close (ESC, backdrop click, close button) */
  onCloseDialog: () => void
  /** Optional modal title */
  title?: string
  /** Modal content */
  children: ReactNode
}

/**
 * Generic modal component
 * - Closes on ESC key
 * - Closes on backdrop click
 * - Accessible (role="dialog", aria-modal)
 * - Portal rendering with backdrop overlay
 */
export function Modal({ open, onCloseDialog, title, children }: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseDialog()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onCloseDialog])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!open) return

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-default"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCloseDialog}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground rounded-lg shadow-xl border border-border mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-foreground"
            >
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseDialog}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
