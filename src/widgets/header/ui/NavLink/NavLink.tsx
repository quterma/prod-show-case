"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/shared/lib/utils"

type NavLinkProps = {
  href: string
  children: React.ReactNode
}

/**
 * Navigation link with active state styling
 * Used in Header for navigation items
 */
export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  )
}
