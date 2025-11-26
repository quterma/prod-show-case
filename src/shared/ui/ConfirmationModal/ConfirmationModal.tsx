"use client"

import { Button } from "../Button"
import { Modal } from "../Modal"

type ConfirmationModalProps = {
  /** Controls modal visibility */
  open: boolean
  /** Called when modal is closed (via cancel or backdrop) */
  onClose: () => void
  /** Called when confirm button is clicked */
  onConfirm: () => void
  /** Modal title */
  title: string
  /** Modal description/content */
  description: string
  /** Text for confirm button (default: "Confirm") */
  confirmText?: string
  /** Text for cancel button (default: "Cancel") */
  cancelText?: string
  /** Visual variant for confirm button (default: "primary") */
  variant?: "primary" | "destructive" | "outline" | "secondary" | "ghost"
}

/**
 * Reusable confirmation modal
 * Wraps the generic Modal component with a standard layout for confirmation dialogs.
 */
export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onCloseDialog={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="outline">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant={variant}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
