"use client"

import { useState } from "react"
import {
  Search,
  RefreshCw,
  BarChart3,
  Activity,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockTransactions = [
  {
    cod_etapa: "DET_OWNER_EVENTO",
    descricao: "Publicação do evento",
    doc_origem: "SR1560657030",
    doc_destino: null,
    timestamp: "2025-05-07T12:28:25.725735Z",
    erro_string: "Falha ao publicar evento",
    aguardando_reprocessamento: true,
  },
  {
    cod_etapa: "DET_FINAL_EVENTO",
    descricao: "Finalização do evento criado",
    doc_origem: "SR1560657031",
    doc_destino: "EVT-00123",
    timestamp: "2025-05-07T14:32:00.000000Z",
    erro_string: null,
    aguardando_reprocessamento: false,
  },
  {
    cod_etapa: "PROC_VALIDATION",
    descricao: "Validação da estrutura do documento",
    doc_origem: "SR1560657032",
    doc_destino: "VAL-00456",
    timestamp: "2025-05-07T15:45:12.123456Z",
    erro_string: null,
    aguardando_reprocessamento: false,
  },
  {
    cod_etapa: "DATA_TRANSFORM",
    descricao: "Transformação do formato de dados",
    doc_origem: "SR1560657033",
    doc_destino: null,
    timestamp: "2025-05-07T16:20:30.987654Z",
    erro_string: "Falha na transformação: Formato inválido",
    aguardando_reprocessamento: true,
  },
  {
    cod_etapa: "SEND_NOTIFICATION",
    descricao: "Envio de notificação ao cliente",
    doc_origem: "SR1560657034",
    doc_destino: "NOT-00789",
    timestamp: "2025-05-07T17:10:45.555555Z",
    erro_string: null,
    aguardando_reprocessamento: false,
  },
]

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "#",
  },
  {
    title: "Rastreador de Transações",
    icon: Activity,
    url: "#",
    isActive: true,
  },
  {
    title: "Relatórios",
    icon: FileText,
    url: "#",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "#",
  },
]

function AppSidebar() {
  return (
    <Sidebar className="border-r border-saga-mint/20">
      <SidebarHeader className="border-b border-saga-mint/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-saga-mint to-saga-petrol rounded-lg flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white">Saga</span>
            <span className="text-xs text-saga-mint">Consultoria</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-saga-mint text-xs font-medium mb-2">NAVEGAÇÃO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="w-full justify-start gap-3 px-3 py-2.5 text-white hover:bg-saga-mint/20 hover:text-saga-mint data-[active=true]:bg-gradient-to-r data-[active=true]:from-saga-mint data-[active=true]:to-saga-mint/70 data-[active=true]:text-saga-petrol data-[active=true]:shadow-md data-[active=true]:shadow-saga-mint/20 transition-all duration-200"
                  >
                    <a href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: boolean }) {
  if (status) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saga-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saga-orange"></span>
        </span>
        <Badge
          variant="secondary"
          className="bg-saga-orange/10 text-saga-orange border-saga-orange/20 font-medium px-2.5 py-1"
        >
          Pendente
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saga-mint"></span>
      </span>
      <Badge
        variant="secondary"
        className="bg-saga-mint/10 text-saga-petrol border-saga-mint/20 font-medium px-2.5 py-1"
      >
        Concluído
      </Badge>
    </div>
  )
}

export default function TransactionTracker() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredTransactions = mockTransactions
    .filter(
      (transaction) =>
        transaction.cod_etapa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.doc_origem.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortField) return 0

      const fieldA = a[sortField as keyof typeof a]
      const fieldB = b[sortField as keyof typeof b]

      if (fieldA === null) return sortDirection === "asc" ? 1 : -1
      if (fieldB === null) return sortDirection === "asc" ? -1 : 1

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      }

      if (fieldA === fieldB) return 0
      return sortDirection === "asc" ? (fieldA < fieldB ? -1 : 1) : fieldA < fieldB ? 1 : -1
    })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <SidebarInset className="flex-1">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-saga-petrol hover:bg-saga-mint/20" />
                  <h1 className="text-2xl font-bold text-saga-petrol">Rastreador de Transações</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-saga-petrol text-saga-petrol hover:bg-saga-petrol hover:text-white"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar por data</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-saga-petrol text-saga-petrol hover:bg-saga-petrol hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exportar dados</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    onClick={handleRefresh}
                    variant="default"
                    size="sm"
                    className="bg-saga-petrol text-white hover:bg-saga-petrol/90"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por código, descrição ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-saga-petrol focus:ring-saga-petrol"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-saga-petrol text-saga-petrol">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Todos</DropdownMenuItem>
                    <DropdownMenuItem>Pendentes</DropdownMenuItem>
                    <DropdownMenuItem>Concluídos</DropdownMenuItem>
                    <DropdownMenuItem>Com Erros</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Summary Stats */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Transações</p>
                      <p className="text-3xl font-bold text-saga-petrol mt-1">{filteredTransactions.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-saga-petrol to-saga-petrol/70 rounded-lg flex items-center justify-center shadow-md">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-3xl font-bold text-saga-orange mt-1">
                        {filteredTransactions.filter((t) => t.aguardando_reprocessamento).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-saga-orange to-saga-orange/70 rounded-lg flex items-center justify-center shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Com Erros</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">
                        {filteredTransactions.filter((t) => t.erro_string).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Concluídos</p>
                      <p className="text-3xl font-bold text-saga-mint mt-1">
                        {filteredTransactions.filter((t) => !t.aguardando_reprocessamento && !t.erro_string).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-saga-mint to-saga-mint/70 rounded-lg flex items-center justify-center shadow-md">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-saga-petrol to-saga-petrol/90 text-white border-b-0">
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("cod_etapa")}
                        >
                          <div className="flex items-center gap-1">
                            Código
                            {getSortIcon("cod_etapa")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("descricao")}
                        >
                          <div className="flex items-center gap-1">
                            Descrição
                            {getSortIcon("descricao")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("doc_origem")}
                        >
                          <div className="flex items-center gap-1">
                            Documento Origem
                            {getSortIcon("doc_origem")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("doc_destino")}
                        >
                          <div className="flex items-center gap-1">
                            Documento Destino
                            {getSortIcon("doc_destino")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("timestamp")}
                        >
                          <div className="flex items-center gap-1">
                            Data/Hora
                            {getSortIcon("timestamp")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Erro</TableHead>
                        <TableHead
                          className="font-semibold cursor-pointer hover:bg-saga-petrol/90 transition-colors"
                          onClick={() => handleSort("aguardando_reprocessamento")}
                        >
                          <div className="flex items-center gap-1">
                            Status
                            {getSortIcon("aguardando_reprocessamento")}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction, index) => (
                        <TableRow
                          key={index}
                          className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                            transaction.erro_string
                              ? "bg-red-50/30"
                              : transaction.aguardando_reprocessamento
                                ? "bg-saga-orange/5"
                                : ""
                          }`}
                        >
                          <TableCell className="font-mono text-sm font-medium text-saga-petrol py-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help border-b border-dotted border-saga-petrol/50">
                                  {transaction.cod_etapa}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Código da etapa do processo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-gray-700 py-4 min-w-[200px]">{transaction.descricao}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-600 py-4">
                            {transaction.doc_origem}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gray-600 py-4">
                            {transaction.doc_destino || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 py-4 whitespace-nowrap">
                            {formatTimestamp(transaction.timestamp)}
                          </TableCell>
                          <TableCell className="py-4">
                            {transaction.erro_string ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 text-red-600 text-sm bg-red-50 px-3 py-1.5 rounded-full max-w-[200px] truncate">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{transaction.erro_string}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{transaction.erro_string}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <StatusBadge status={transaction.aguardando_reprocessamento} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Nenhuma transação encontrada</p>
                    <p className="text-sm">Tente ajustar seus critérios de busca</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Exibindo <span className="font-medium">{filteredTransactions.length}</span> transações
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="text-saga-petrol">
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled className="text-saga-petrol">
                    Próxima
                  </Button>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}
