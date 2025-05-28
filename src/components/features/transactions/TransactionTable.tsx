"use client"

import { useState } from "react"
import { AlertCircle, Activity, MoreHorizontal, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react"
import { Filter } from "lucide-react"
import { TransactionDetailsModal } from "./TransactionDetailsModal"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const mockData = [
  {
    id: "6ac34b0e-4b57-4ece-bb04-f5e80ed940e9",
    id_processo: "c3a82eb8-5c25-4612-b4b9-4939297df289",
    processo: "CriacaoEventos",
    cod_etapa: "DET_OWNER_EVENTO",
    descricao: "Executa a publicação do Evento",
    sequencia: "500",
    doc_origem: "SR1560657030",
    doc_destino: null,
    timestamp: "2025-05-07T12:28:25.725735Z",
    processado_sucesso: true,
    permite_reprocessar: false,
    erro_string: "Falha na conexão com o servidor de destino",
    aguardando_reprocessamento: false,
    historico: [
      { etapa: "Capturado", data: "2025-05-07T12:00:00Z", status: "done" },
      { etapa: "Validado", data: "2025-05-07T12:10:00Z", status: "done" },
      { etapa: "Publicado", data: "2025-05-07T12:20:00Z", status: "error" }
    ]
  },
  {
    id: "7bd45c1f-5c68-5fdf-cc15-g6f91fe051fa",
    id_processo: "d4b93fc9-6d36-5723-c5ca-5a4a3a8eg0a8",
    processo: "CriacaoEventos",
    cod_etapa: "DET_FINAL_EVENTO",
    descricao: "Finalização do evento",
    sequencia: "600",
    doc_origem: "SR1560657031",
    doc_destino: "EVT-00123",
    timestamp: "2025-05-07T14:32:00.000000Z",
    processado_sucesso: true,
    permite_reprocessar: false,
    erro_string: null,
    aguardando_reprocessamento: false,
    historico: [
      { etapa: "Capturado", data: "2025-05-07T14:00:00Z", status: "done" },
      { etapa: "Validado", data: "2025-05-07T14:15:00Z", status: "done" },
      { etapa: "Finalizado", data: "2025-05-07T14:30:00Z", status: "done" }
    ]
  },
  {
    id: "8ce56d2g-6d79-6geg-dd26-h7g02gf162gb",
    id_processo: "e5ca4gda-7e47-6834-d6db-6b5b4b9fh1b9",
    processo: "CriacaoEventos",
    cod_etapa: "DET_VALIDACAO_EVENTO",
    descricao: "Validação de dados do evento",
    sequencia: "400",
    doc_origem: "SR1560657032",
    doc_destino: null,
    timestamp: "2025-05-07T16:15:00.000000Z",
    processado_sucesso: true,
    permite_reprocessar: true,
    erro_string: null,
    aguardando_reprocessamento: true,
  },
]

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getStatusInfo = (transaction: any) => {
  if (transaction.erro_string !== null) {
    return {
      label: "Erro",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      dotColor: "bg-red-500"
    }
  }
  if (transaction.aguardando_reprocessamento === true) {
    return {
      label: "Aguardando",
      icon: Clock,
      className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      dotColor: "bg-orange-500"
    }
  }
  return {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    dotColor: "bg-green-500"
  }
}

export function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const pageSize = 5

  const filteredData = mockData.filter((t) =>
    t.cod_etapa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.doc_origem.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Statistics
  const stats = {
    total: mockData.length,
    success: mockData.filter(t => t.processado_sucesso).length,
    error: mockData.filter(t => t.erro_string).length,
    pending: mockData.filter(t => t.aguardando_reprocessamento).length
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map(t => t.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id))
    }
  }

  const handleReprocessSelected = () => {
    // Aqui você implementaria a lógica de reprocessamento
    console.log('Reprocessar:', selectedItems)
    setSelectedItems([])
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction Tracker</h1>
          <p className="text-sm text-slate-500">Monitore e gerencie suas transações SAP</p>
        </div>
        {selectedItems.length > 0 && (
          <Button
            onClick={handleReprocessSelected}
            className="bg-[#005F61] hover:bg-[#005F61]/90 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reprocessar Selecionados ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-full">
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">{stats.success}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Com Erros</p>
              <p className="text-2xl font-bold text-red-600">{stats.error}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Input
              placeholder="Buscar por código, descrição ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Filter className="w-4 h-4" />
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Pendentes</DropdownMenuItem>
              <DropdownMenuItem>Concluídos</DropdownMenuItem>
              <DropdownMenuItem>Com Erros</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-sidebar text-sidebar-foreground">
            <TableRow>
              <TableHead className="text-white font-semibold text-sm w-12">
                <Checkbox 
                  checked={selectedItems.length === paginatedData.length}
                  onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#005F61]"
                />
              </TableHead>
              <TableHead className="text-white font-semibold text-sm">Código Etapa</TableHead>
              <TableHead className="text-white font-semibold text-sm">Descrição</TableHead>
              <TableHead className="text-white font-semibold text-sm">Doc. Origem</TableHead>
              <TableHead className="text-white font-semibold text-sm">Doc. Destino</TableHead>
              <TableHead className="text-white font-semibold text-sm">Data/Hora</TableHead>
              <TableHead className="text-white font-semibold text-sm">Status</TableHead>
              <TableHead className="text-white font-semibold text-sm text-center">Detalhes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((t, i) => {
              const statusInfo = getStatusInfo(t)
              const StatusIcon = statusInfo.icon
              
              return (
                <TableRow 
                  key={i} 
                  className="hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(t.id)}
                      onCheckedChange={(checked: boolean) => handleSelectItem(t.id, checked)}
                      className="border-slate-300 data-[state=checked]:bg-[#005F61]"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium text-slate-900">
                    {t.cod_etapa}
                  </TableCell>
                  <TableCell className="text-slate-700 max-w-xs">
                    <div className="truncate" title={t.descricao}>
                      {t.descricao}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">
                    {t.doc_origem}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">
                    {t.doc_destino || (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(t.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge className={`${statusInfo.className} font-medium transition-colors w-fit`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </div>
                      </Badge>
                      {t.erro_string && (
                        <div className="flex items-start gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-32" title={t.erro_string}>
                            {t.erro_string}
                          </span>
                        </div>
                      )}
                      {t.aguardando_reprocessamento && (
                        <div className="flex items-start gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200 mt-1">
                          <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="text-xs">Aguardando reprocessamento</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTransaction(t)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      title="Ver detalhes"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-500">Tente ajustar seus critérios de busca</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-slate-600">
            Exibindo <strong className="text-slate-900">{paginatedData.length}</strong> de{" "}
            <strong className="text-slate-900">{filteredData.length}</strong> transações
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="border-gray-300"
            >
              Anterior
            </Button>
            <div className="flex items-center px-3 py-1 text-sm text-slate-600 bg-slate-50 rounded border">
              {currentPage} de {totalPages}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-gray-300"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      <TransactionDetailsModal
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  )
}
