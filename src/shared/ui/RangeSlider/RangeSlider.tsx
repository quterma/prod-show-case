"use client"

import * as Slider from "@radix-ui/react-slider"
import { forwardRef } from "react"

import { cn } from "@/shared/lib/utils"

export type RangeSliderProps = {
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step increment */
  step?: number
  /** Current value as [min, max] */
  value: [number, number]
  /** Callback when value changes */
  onValueChange: (value: [number, number]) => void
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Custom class for the root element */
  className?: string
  /** Label text displayed above the slider */
  label?: string
  /** Show current values below the slider */
  showValues?: boolean
  /** Custom formatter for displayed values */
  formatValue?: (value: number) => string
}

/**
 * RangeSlider component - a wrapper over Radix UI Slider
 * Supports dual thumbs for selecting a range between min and max values
 */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      min,
      max,
      step = 1,
      value,
      onValueChange,
      disabled = false,
      className,
      label,
      showValues = true,
      formatValue = (v) => v.toString(),
    },
    ref
  ) => {
    const handleValueChange = (newValue: number[]) => {
      // Ensure we have exactly 2 values
      if (newValue.length !== 2) return

      let [minVal, maxVal] = newValue

      // Clamp values to min/max bounds
      minVal = Math.max(min, Math.min(max, minVal))
      maxVal = Math.max(min, Math.min(max, maxVal))

      // Ensure minVal <= maxVal
      if (minVal > maxVal) {
        ;[minVal, maxVal] = [maxVal, minVal]
      }

      onValueChange([minVal, maxVal])
    }

    return (
      <div className={cn("flex flex-col gap-2", className)} ref={ref}>
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <Slider.Root
          className={cn(
            "relative flex h-5 w-full touch-none select-none items-center",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          value={value}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <Slider.Range className="absolute h-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb
            className={cn(
              "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "hover:bg-primary/10",
              !disabled && "cursor-grab active:cursor-grabbing"
            )}
          />
          <Slider.Thumb
            className={cn(
              "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "hover:bg-primary/10",
              !disabled && "cursor-grab active:cursor-grabbing"
            )}
          />
        </Slider.Root>
        {showValues && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatValue(value[0])}</span>
            <span>{formatValue(value[1])}</span>
          </div>
        )}
      </div>
    )
  }
)

RangeSlider.displayName = "RangeSlider"
