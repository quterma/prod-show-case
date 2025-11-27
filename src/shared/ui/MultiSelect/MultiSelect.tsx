"use client"

import { Check, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options: MultiSelectOption[]
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  value,
  onChange,
  options,
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleToggle = (optionValue: string) => {
    // If currently in ALL state (empty or full), clicking a category should select ONLY that category
    if (value.length === 0 || value.length === options.length) {
      onChange([optionValue])
      return
    }

    // Otherwise, toggle normally
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]

    // If deselecting would result in empty array, reset to ALL state
    if (newValue.length === 0) {
      onChange([])
    } else if (newValue.length === options.length) {
      // If selecting all categories manually, reset to ALL state (empty array)
      onChange([])
    } else {
      onChange(newValue)
    }
  }

  const handleSelectAll = () => {
    // Set to empty array (ALL state = no filter)
    onChange([])
  }

  // ALL is selected when no categories selected (empty = all, no filter)
  const isAllSelected = value.length === 0

  const getButtonLabel = () => {
    if (value.length === 0 || value.length === options.length) {
      return "All selected"
    }
    return `${value.length} selected`
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer hover:bg-accent/50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span
          className={cn(
            value.length === 0 && "text-muted-foreground",
            "truncate"
          )}
        >
          {getButtonLabel()}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="p-1">
            {/* Select All option */}
            <div
              onClick={handleSelectAll}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors font-medium",
                isAllSelected && "bg-accent text-accent-foreground"
              )}
            >
              <span className="flex-1">All</span>
              {isAllSelected && (
                <Check className="h-4 w-4 text-primary shrink-0 absolute right-2" />
              )}
            </div>

            {/* Separator */}
            <div className="my-1 h-px bg-border" />

            {/* Individual options */}
            {options.map((option) => {
              // Show checkmark only when partially selected (not ALL state, not empty)
              const isSelected =
                value.includes(option.value) && value.length > 0
              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="flex-1 capitalize">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0 absolute right-2" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
