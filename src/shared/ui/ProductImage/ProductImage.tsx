"use client"

import { ImageOff } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"

import { Skeleton } from "../Skeleton"

type ProductImageProps = {
  src: string
  alt: string
  className?: string
  fallbackMessage?: string
  priority?: boolean
  sizes?: string
}

/**
 * ProductImage component with loading, error, and fallback states
 *
 * Features:
 * - Shows skeleton while image is loading
 * - Displays placeholder on error or empty src
 * - Supports custom fallback message
 * - Works with Next.js Image optimization
 */
export function ProductImage({
  src,
  alt,
  className,
  fallbackMessage = "Image not available",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Show placeholder if src is empty or error occurred
  const shouldShowPlaceholder = !src || hasError

  if (shouldShowPlaceholder) {
    return (
      <div
        className={cn(
          "aspect-square relative bg-muted rounded-md flex flex-col items-center justify-center p-8 text-muted-foreground",
          className
        )}
      >
        <ImageOff className="w-16 h-16 mb-3 opacity-40" />
        <p className="text-sm text-center font-medium opacity-60">
          {fallbackMessage}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn("aspect-square relative bg-muted rounded-md", className)}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-opacity",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}
