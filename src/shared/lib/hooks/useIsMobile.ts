import { useEffect, useState } from "react"

/**
 * Mobile breakpoint (matches Tailwind's md breakpoint)
 */
const MOBILE_BREAKPOINT = 768

/**
 * Check if current viewport is mobile width
 */
function checkIsMobile(): boolean {
  // SSR safety: return false (desktop) during SSR
  if (typeof window === "undefined") {
    return false
  }

  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Hook to determine if viewport is mobile width (< 768px)
 * Used to disable pagination on mobile devices
 *
 * @returns true if mobile width, false otherwise
 */
export function useIsMobile(): boolean {
  // Lazy initialization: check mobile status only once on mount
  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile)

  useEffect(() => {
    // Update mobile status on resize
    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
