"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ROUTES, isActiveRoute } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { ThemeToggle } from "@/shared/ui"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            href={ROUTES.home}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActiveRoute(pathname, ROUTES.home)
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href={ROUTES.products.list}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActiveRoute(pathname, ROUTES.products.list)
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Products
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
