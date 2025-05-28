"use client"

import { useState } from "react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Activity, AlertCircle, BarChart3, ChevronDown, ChevronUp, LayoutDashboard, Settings } from "lucide-react"


const menuStructure = [
  {
    title: "Ariba Better",
    icon: BarChart3,
    children: [
      { title: "Dashboard", url: "#", icon: LayoutDashboard },
      { title: "Logs de erro", url: "#", icon: AlertCircle },
      { title: "Configurações", url: "#", icon: Settings },
      { title: "Transaction Tracker", url: "#", icon: Activity, isActive: true },
    ],
  },
]

export function AppSidebar() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  return (
    <Sidebar className="bg-gradient-to-b from-[#004d61] to-[#003948] text-white border-r border-[#007487]/20 min-h-screen">

      <SidebarHeader className="border-b border-saga-mint/10 px-6 py-5">
  <div className="flex items-center gap-3">
    <img
      src="/logo-saga.png"
      alt="Saga Consultoria"
      className="h-10 w-auto object-contain"
    />
  </div>
</SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-saga-mint/60 tracking-wide mb-3">
            PRODUTOS ATIVOS
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuStructure.map((group) => (
                <div key={group.title} className="mb-2">
                  {/* Botão do grupo principal */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-saga-mint/10 rounded-md transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <group.icon className="w-4 h-4 text-saga-mint" />
                        <span className="text-sm font-medium">{group.title}</span>
                      </div>
                      {openGroups[group.title] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Submenus */}
                  {openGroups[group.title] && (
                    <div className="mt-2 pl-2 space-y-1">
                      {group.children.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.isActive}
                            className={`
                              w-full justify-start gap-2 px-4 py-2 text-sm rounded-md
                              hover:bg-saga-mint/10 hover:text-saga-mint
                              data-[active=true]:bg-saga-mint/10
                              data-[active=true]:border-l-4 data-[active=true]:border-saga-mint
                              data-[active=true]:text-saga-mint
                            `}
                          >
                            <a href={item.url} className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              {item.title}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
