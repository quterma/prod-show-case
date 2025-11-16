/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  } as T & { cancel: () => void }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
