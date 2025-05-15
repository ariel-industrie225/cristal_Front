import type React from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import ProtectionRoute from "@/components/dashboard/ProtectionRoute"
import { SidebarProvider } from "@/contexts/sidebar-context"
import MainContent from "@/components/dashboard/main-content"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectionRoute>
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </ProtectionRoute>
  )
}
