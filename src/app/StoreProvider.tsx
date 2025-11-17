"use client"

import { useEffect, useState } from "react"
import { Provider } from "react-redux"

import { makeStore, flushPersist } from "@/shared/lib/store"

/**
 * StoreProvider - Redux store provider following official RTK pattern
 * React 19 compatible: uses useState with lazy initializer
 * See: https://redux-toolkit.js.org/usage/nextjs
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Use useState with lazy initializer to create store only once
  // This is React 19 compatible and avoids ref access during render
  const [store] = useState(() => makeStore())

  // Flush pending persist operations on page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushPersist(store)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [store])

  return <Provider store={store}>{children}</Provider>
}
