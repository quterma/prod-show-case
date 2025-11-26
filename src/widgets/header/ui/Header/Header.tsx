"use client"

import { ROUTES } from "@/shared/config"
import { ThemeToggle } from "@/shared/ui"

import { NavLink } from "../NavLink"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <NavLink href={ROUTES.home}>Home</NavLink>
          <NavLink href={ROUTES.products.list}>Products</NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
