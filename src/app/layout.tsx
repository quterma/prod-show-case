import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Header } from "@/widgets/header"

import StoreProvider from "./StoreProvider"
import { ThemeProvider } from "./ThemeProvider"
import { ToastProvider } from "./ToastProvider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "prod-show-case",
  description:
    "Production showcase application with forms and state management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[432px]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <StoreProvider>
            <main>{children}</main>
          </StoreProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
