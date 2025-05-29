"use client"

import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock, XCircle, FileText, Truck, Receipt, Loader2, Send, File, X } from "lucide-react"
import { TransactionsService } from "@/services/transactions"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

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
  if (!transaction) return {
    label: "",
    icon: AlertCircle,
    className: "",
    dotColor: ""
  }

  if (transaction.erro_string) {
    return {
      label: "Erro",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500"
    }
  }
  if (transaction.aguardando_reprocessamento) {
    return {
      label: "Aguardando",
      icon: Clock,
      className: "bg-orange-50 text-orange-700 border-orange-200",
      dotColor: "bg-orange-500"
    }
  }
  return {
    label: "Concluído",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200",
    dotColor: "bg-green-500"
  }
}

interface TransactionDetailsModalProps {
  transaction: any
  onClose: () => void
  onUpdate: () => void
}

const getTimelineStep = (data: any) => {
  if (!data || !Array.isArray(data)) return []

  // Ordenar os dados por sequência
  const sortedData = [...data].sort((a, b) => Number(a.sequencia) - Number(b.sequencia))
  const currentStep = sortedData.find(step => !step.processado_sucesso)

  return sortedData.map(step => {
    let status = 'pending'
    
    if (step.processado_sucesso) {
      status = 'completed'
    } else if (step.erro_string) {
      status = 'error'
    } else if (step.aguardando_reprocessamento) {
      status = 'waiting'
    } else if (step.cod_etapa === currentStep?.cod_etapa) {
      status = 'in_progress'
    }

    const getIcon = (etapa: string) => {
      switch (etapa) {
        case 'CAP_SR':
          return FileText
        case 'CAP_PO':
          return FileText
        case 'CRIAR_PEDIDO':
          return FileText
        case 'CRIAR_NF':
          return Receipt
        case 'ENV_NF':
          return Send
        default:
          return FileText
      }
    }

    return {
      id: step.cod_etapa,
      title: step.descricao,
      description: `Etapa ${step.sequencia}`,
      icon: getIcon(step.cod_etapa),
      status,
      erro_string: step.erro_string
    }
  })
}

export function TransactionDetailsModal({ transaction, onClose, onUpdate }: TransactionDetailsModalProps) {
  const [detailedData, setDetailedData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const status = getStatusInfo(detailedData?.[0])

  useEffect(() => {
    if (transaction?.id) {
      fetchTransactionDetails()
    }
  }, [transaction?.id])

  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/proxy?path=AribaBetter/TransactionTracker&id=${transaction.id}`)

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      console.log('Dados detalhados:', data)
      setDetailedData(data)
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      toast.error('Erro ao carregar detalhes da transação')
    } finally {
      setIsLoading(false)
    }
  }

  const timelineSteps = getTimelineStep(detailedData)
  const currentData = detailedData?.[0]

  const handleReprocess = async () => {
    try {
      await TransactionsService.reprocess(currentData?.cod_etapa)
      toast.success('Transação enviada para reprocessamento')
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Erro ao reprocessar transação:', error)
      toast.error('Erro ao reprocessar transação')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 bg-white outline-none">
        <VisuallyHidden>
          <DialogTitle>Detalhes da Transação</DialogTitle>
        </VisuallyHidden>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-saga-petrol" />
                <h2 className="text-lg font-medium text-gray-700">
                  {currentData?.doc_destino || currentData?.doc_origem || "Detalhes da Transação"}
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Processo: <span className="font-medium text-gray-700">{currentData?.processo || "-"}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentData?.processado_sucesso && (
                <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Processado com Sucesso
                </Badge>
              )}
              <DialogClose className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-5rem)] overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-saga-petrol" />
                  <span className="text-saga-graphite">Carregando detalhes...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Status Section - Only show if there's an error or waiting for reprocessing */}
                {(currentData?.erro_string || currentData?.aguardando_reprocessamento) && (
                  <div className={`p-4 rounded-xl border ${status.className} bg-opacity-50`}>
                    <div className="flex items-center gap-3">
                      <status.icon className="w-5 h-5" />
                      <span className="font-medium">{status.label}</span>
                    </div>
                    {currentData?.erro_string && (
                      <div className="mt-3 flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-red-700">{currentData.erro_string}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">ID</label>
                      <p className="text-gray-700 mt-1 font-mono text-sm">{currentData?.id || "-"}</p>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">ID do Processo</label>
                      <p className="text-gray-700 mt-1 font-mono text-sm break-all">{currentData?.id_processo || "-"}</p>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">Código da Etapa</label>
                      <p className="text-gray-700 mt-1 font-mono text-sm">{currentData?.cod_etapa || "-"}</p>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">Sequência</label>
                      <p className="text-gray-700 mt-1 text-sm">{currentData?.sequencia || "-"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">Documento Origem</label>
                      <p className="text-gray-700 mt-1 font-mono text-sm">{currentData?.doc_origem || "-"}</p>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">Documento Destino</label>
                      <p className="text-gray-700 mt-1 font-mono text-sm">{currentData?.doc_destino || "-"}</p>
                    </div>
                    <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <label className="text-sm font-medium text-gray-500 block">Data/Hora</label>
                      <p className="text-gray-700 mt-1 text-sm">{currentData?.timestamp ? formatDate(currentData.timestamp) : "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Status Details */}
                <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <label className="text-sm font-medium text-gray-500 block mb-3">Status do Processamento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentData?.processado_sucesso ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-gray-700">
                        {currentData?.processado_sucesso ? 'Processado com Sucesso' : 'Processamento Falhou'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentData?.aguardando_reprocessamento ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <span className="text-sm text-gray-700">
                        {currentData?.aguardando_reprocessamento ? 'Aguardando Reprocessamento' : 'Não Aguardando Reprocessamento'}
                      </span>
                    </div>
                  </div>
                </div>

                {currentData?.permite_reprocessar && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleReprocess}
                      className="bg-saga-petrol hover:bg-saga-petrol/90"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reprocessar
                    </Button>
                  </div>
                )}

                {/* Timeline Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-6">Linha do Tempo do Processo</h3>
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {timelineSteps.map((step) => (
                      <div key={step.id} className="relative flex items-start mb-8 last:mb-0 group">
                        <div className="absolute left-0 w-16 flex justify-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 ${
                            step.status === 'completed' ? 'border-green-500 bg-green-50' :
                            step.status === 'error' ? 'border-red-500 bg-red-50' :
                            step.status === 'waiting' ? 'border-orange-500 bg-orange-50' :
                            step.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                            'border-gray-300 bg-gray-50'
                          }`}>
                            <step.icon className={`w-5 h-5 transition-colors ${
                              step.status === 'completed' ? 'text-green-500' :
                              step.status === 'error' ? 'text-red-500' :
                              step.status === 'waiting' ? 'text-orange-500' :
                              step.status === 'in_progress' ? 'text-blue-500' :
                              'text-gray-400'
                            }`} />
                          </div>
                        </div>
                        <div className="ml-24 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-1 hover:border-gray-300 transition-all duration-200 group-hover:shadow-md">
                          <div className="font-medium text-gray-700 mb-2">{step.title}</div>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center justify-between">
                              <span>{step.description}</span>
                              <Badge variant="outline" className={`transition-colors ${
                                step.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                step.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                                step.status === 'waiting' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                step.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {step.status === 'completed' ? 'Concluído' :
                                 step.status === 'error' ? 'Erro' :
                                 step.status === 'waiting' ? 'Aguardando' :
                                 step.status === 'in_progress' ? 'Em Andamento' :
                                 'Pendente'
                                }
                              </Badge>
                            </div>
                            {step.erro_string && (
                              <div className="mt-3 text-sm text-red-600">
                                {step.erro_string}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}