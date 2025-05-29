"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Activity,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Filter } from "lucide-react"
import { TransactionDetailsModal } from "./TransactionDetailsModal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { TransactionsService } from "@/services/transactions"

const formatDate = (ts: string) =>
  new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const getStatusInfo = (tx: any) => {
  if (tx.erro_string) return { label: "Erro", dot: "bg-red-500" }
  if (tx.aguardando_reprocessamento) return { label: "Aguardando", dot: "bg-yellow-500" }
  return { label: "Concluído", dot: "bg-green-500" }
}

export function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchTransactions = async (page = currentPage) => {
    setIsLoading(true)
    try {
      const skip = (page - 1) * pageSize
      const response = await TransactionsService.list({
        count: pageSize,
        skip,
        sort_by: "-sequencia,-timestamp",
      })
      setTransactions(response)
      // substitua por total real da API quando disponível
      setTotalCount(page * pageSize + (response.length === pageSize ? pageSize : 0))
    } catch {
      toast.error("Erro ao carregar transações")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [currentPage])

  const filtered = transactions.filter((t) =>
    [t.cod_etapa, t.descricao, t.doc_origem]
      .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const stats = {
    total: transactions.length,
    error: transactions.filter(t => t.erro_string).length,
    pending: transactions.filter(t => t.aguardando_reprocessamento).length,
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const toggleAll = (checked: boolean) =>
    setSelectedItems(checked ? filtered.map(t => t.cod_etapa) : [])

  const toggleOne = (id: string, checked: boolean) =>
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(x => x !== id)
    )

  const reprocessAll = async () => {
    if (!selectedItems.length) return toast.error("Selecione ao menos uma")
    try {
      await Promise.all(selectedItems.map(id => TransactionsService.reprocess(id)))
      toast.success(`${selectedItems.length} enviada(s) para reprocessamento`)
      setSelectedItems([])
      fetchTransactions()
    } catch {
      toast.error("Falha ao reprocessar")
    }
  }

  return (
    <div className="space-y-8">
      {/* --- Header e Search --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <Button
              onClick={reprocessAll}
              size="sm"
              className="bg-saga-petrol hover:bg-saga-petrol/90 text-white">
              <RefreshCw className="w-4 h-4 mr-1" />
              Reprocessar ({selectedItems.length})
            </Button>
          )}
         <div className="relative">
  <Input
    placeholder="Buscar código, descrição ou doc..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="pl-10 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100"
  />
  <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
</div>
          <Button
            onClick={() => fetchTransactions(currentPage)}
            size="sm"
            variant="outline"
            className="text-gray-600 hover:text-gray-900">
            <RefreshCw
              className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      {/* --- Estatísticas --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, icon: <Activity className="w-5 h-5 text-gray-400" /> },
          { label: "Erros", value: stats.error, icon: <AlertCircle className="w-5 h-5 text-red-400" /> },
          { label: "Aguardando", value: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-400" /> },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-white rounded-lg p-4 border-b border-gray-200 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
            {icon}
          </div>
        ))}
      </div>

      {/* --- Tabela --- */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-8 px-3 py-2">
                <Checkbox
                  checked={selectedItems.length === filtered.length && filtered.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              {["Código", "Descrição", "Doc. Origem", "Doc. Destino", "Data/Hora", "Status", ""]
                .map((h, i) => (
                  <TableHead
                    key={i}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2"
                  >
                    {h}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-gray-400">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  Sem resultados
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(tx => {
                const st = getStatusInfo(tx)
                return (
                  <TableRow
                    key={tx.cod_etapa + tx.timestamp}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <TableCell className="px-3 py-2">
                      <Checkbox
                        checked={selectedItems.includes(tx.cod_etapa)}
                        onCheckedChange={checked =>
                          toggleOne(tx.cod_etapa, checked as boolean)
                        }
                        onClick={e => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm font-medium text-gray-900">
                      {tx.cod_etapa}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-700 truncate">
                      {tx.descricao}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm font-mono text-gray-600">
                      {tx.doc_origem}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm font-mono text-gray-600">
                      {tx.doc_destino || "–"}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-sm text-gray-600">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className={`block w-2 h-2 rounded-full ${st.dot}`} />
                        <span className="text-sm text-gray-700">{st.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={e => {
                          e.stopPropagation()
                          setSelectedTransaction(tx)
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Paginação --- */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            { (currentPage - 1) * pageSize + 1 }–{ Math.min(currentPage * pageSize, totalCount) } de { totalCount }
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            { Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                .map(page => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    className={page === currentPage
                      ? "bg-saga-petrol text-white"
                      : "text-gray-500 hover:text-gray-700"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))
            }
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* --- Modal de Detalhes --- */}
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
