"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Activity, MoreHorizontal, CheckCircle2, Clock, XCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Filter } from "lucide-react"
import { TransactionDetailsModal } from "./TransactionDetailsModal"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/services/api"
import { toast } from "sonner"
import { TransactionsService } from "@/services/transactions"

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
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchTransactions = async (page = currentPage) => {
    try {
      setIsLoading(true)
      const skip = (page - 1) * pageSize
      const response = await TransactionsService.list({
        count: pageSize,
        skip,
        sort_by: '-sequencia,-timestamp'
      })
      setTransactions(response)
      // Assumindo que a API retorna o total em algum header ou campo
      // setTotalCount(totalFromAPI)
      setTotalCount(Math.max(skip + response.length + pageSize, response.length * 2)) // Temporário
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      toast.error('Erro ao carregar transações')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [currentPage])

  const filteredData = transactions.filter((t) =>
    t.cod_etapa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.doc_origem.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Statistics
  const stats = {
    total: transactions.length,
    error: transactions.filter(t => t.erro_string !== null).length,
    pending: transactions.filter(t => t.aguardando_reprocessamento).length
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(t => t.cod_etapa))
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

  const handleReprocessSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('Selecione pelo menos uma transação para reprocessar')
      return
    }

    try {
      const promises = selectedItems.map(id => TransactionsService.reprocess(id))
      await Promise.all(promises)
      toast.success(`${selectedItems.length} transação(ões) enviada(s) para reprocessamento`)
      fetchTransactions()
      setSelectedItems([])
    } catch (error) {
      console.error('Erro ao reprocessar transações:', error)
      toast.error('Erro ao reprocessar transações')
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-8">
      {/* Title and Search Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-saga-graphite">Transaction Tracker</h1>
            <p className="text-sm text-saga-graphite/60 mt-1">Monitore e gerencie suas transações SAP</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <Button
                onClick={handleReprocessSelected}
                variant="default"
                size="lg"
                className="bg-saga-petrol hover:bg-saga-petrol-dark text-white"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reprocessar {selectedItems.length} selecionado(s)
              </Button>
            )}
            <Button
              onClick={() => fetchTransactions(currentPage)}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="text-saga-graphite hover:text-saga-petrol hover:border-saga-petrol/20"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-2xl">
          <Input
            placeholder="Buscar por código, descrição ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-lg bg-white border-gray-200 rounded-xl shadow-sm"
          />
          <Filter className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-saga-graphite/40" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-medium text-saga-graphite/70">Total de Transações</p>
              <p className="text-3xl font-bold text-saga-graphite mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-saga-mint/10 rounded-xl">
              <Activity className="w-6 h-6 text-saga-petrol" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-medium text-saga-graphite/70">Com Erros</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.error}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-medium text-saga-graphite/70">Aguardando</p>
              <p className="text-3xl font-bold text-saga-orange mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-saga-orange" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-saga-petrol/5">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-saga-petrol/20"
                />
              </TableHead>
              <TableHead className="font-semibold text-saga-graphite py-4">Código Etapa</TableHead>
              <TableHead className="font-semibold text-saga-graphite">Descrição</TableHead>
              <TableHead className="font-semibold text-saga-graphite">Doc. Origem</TableHead>
              <TableHead className="font-semibold text-saga-graphite">Doc. Destino</TableHead>
              <TableHead className="font-semibold text-saga-graphite">Data/Hora</TableHead>
              <TableHead className="font-semibold text-saga-graphite">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-saga-petrol" />
                    <span className="text-saga-graphite">Carregando transações...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-6 h-6 text-saga-graphite/40" />
                    <span className="text-saga-graphite">Nenhuma transação encontrada</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((transaction) => {
                const status = getStatusInfo(transaction)
                return (
                  <TableRow 
                    key={transaction.cod_etapa + transaction.timestamp} 
                    className="hover:bg-saga-petrol/5 transition-colors cursor-pointer"
                  >
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedItems.includes(transaction.cod_etapa)}
                        onCheckedChange={(checked) => handleSelectItem(transaction.cod_etapa, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                        className="border-saga-petrol/20"
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium text-saga-graphite py-4"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {transaction.cod_etapa}
                    </TableCell>
                    <TableCell 
                      className="text-saga-graphite/80 max-w-[300px] truncate" 
                      title={transaction.descricao}
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {transaction.descricao}
                    </TableCell>
                    <TableCell 
                      className="font-mono text-sm text-saga-graphite/70"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {transaction.doc_origem}
                    </TableCell>
                    <TableCell 
                      className="font-mono text-sm text-saga-graphite/70"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {transaction.doc_destino || "-"}
                    </TableCell>
                    <TableCell 
                      className="text-sm text-saga-graphite/70"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell onClick={() => setSelectedTransaction(transaction)}>
                      <Badge className={`${status.className} px-3 py-1`}>
                        <status.icon className="w-3.5 h-3.5 mr-1.5" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-saga-mint/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTransaction(transaction)
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5 text-saga-graphite/70" />
                        <span className="sr-only">Ver detalhes</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {!isLoading && filteredData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-saga-graphite/70">
            Mostrando {((currentPage - 1) * pageSize) + 1} até {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-saga-graphite hover:text-saga-petrol"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={currentPage === pageNumber ? "bg-saga-petrol text-white" : "text-saga-graphite hover:text-saga-petrol"}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-saga-graphite/40">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="text-saga-graphite hover:text-saga-petrol"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-saga-graphite hover:text-saga-petrol"
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={() => fetchTransactions(currentPage)}
        />
      )}
    </div>
  )
}
