"use client"

import { SidebarTrigger } from "../ui/sidebar"
import { Menu } from "lucide-react"

interface HeaderProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-16 border-b border-gray-200">
        <div className="flex h-full items-center justify-between px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <SidebarTrigger>
              <div className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 active:bg-gray-100">
                <Menu className="h-5 w-5 text-gray-600 hover:text-saga-petrol transition-colors stroke-[1.75]" />
              </div>
            </SidebarTrigger>
            <div className="flex flex-col">
              <h1 className="text-xl font-medium text-gray-700">
                Bem-vindo, <span className="text-gray-400 font-normal text-base">User_Demo</span>
              </h1>
            </div>
          </div>

          {/* Right section - Status */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50/50 border border-green-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}