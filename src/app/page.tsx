"use client"

import { TransactionTable } from "../components/features/transactions/TransactionTable"
import { Header } from "../components/layouts/Header"
import { AppSidebar } from "../components/layouts/Sidebar"
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar"
import { useState } from "react"

export default function Page() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <SidebarProvider>
      <div className="flex w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          <main className="p-6 overflow-auto">
            <TransactionTable />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
