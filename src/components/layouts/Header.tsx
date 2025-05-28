
"use client"

import { SidebarTrigger } from "../ui/sidebar"


interface HeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors" />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
  Bem-vindo, <strong className="text-primary font-semibold">User_Demo</strong>
</h1>
            
          </div>
        </div>

        {/* Right section - Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Sistema Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}