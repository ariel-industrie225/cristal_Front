"use client"

import type React from "react"

import { useSidebar } from "@/contexts/sidebar-context"

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      className={`flex-1 transition-all duration-300 ${
        isMobile
          ? "ml-0"
          : isOpen
            ? "ml-64" // Barre latérale ouverte
            : "ml-20" // Barre latérale réduite
      }`}
    >
      <main className="p-4 md:p-6 pt-16 md:pt-6">{children}</main>
    </div>
  )
}
