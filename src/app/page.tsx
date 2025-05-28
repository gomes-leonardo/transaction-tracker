"use client"

import { useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/Sidebar"
import { Header } from "@/components/layouts/Header"
import { TransactionTable } from "@/components/features/transactions/TransactionTable"

export default function Page() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

          <main className="p-6">
            <TransactionTable />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
