"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  Truck, 
  Receipt, 
  FileCheck,
  FileSearch,
  FileWarning,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Send,
  SendHorizonal,
  FileOutput
} from "lucide-react"

interface TransactionDetailsModalProps {
  isOpen: boolean
  transaction: any
  onClose: () => void
}

const getStatusInfo = (transaction: any) => {
  if (transaction?.erro_string) {
    return {
      label: "Erro",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
      dotColor: "bg-red-500"
    }
  }
  if (transaction?.aguardando_reprocessamento) {
    return {
      label: "Aguardando",
      icon: Clock,
      className: "bg-orange-50 text-orange-700 border-orange-200",
      dotColor: "bg-orange-500"
    }
  }
  if (transaction?.processado_sucesso) {
    return {
      label: "Concluído",
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700 border-green-200",
      dotColor: "bg-green-500"
    }
  }
  return {
    label: "Processando",
    icon: RefreshCw,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500"
  }
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
}

export function TransactionDetailsModal({ isOpen, transaction, onClose }: TransactionDetailsModalProps) {
  if (!transaction) return null

  const statusInfo = getStatusInfo(transaction)
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Detalhes da Transação
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${statusInfo.className}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor}`} />
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium text-lg">{statusInfo.label}</span>
            </div>
            {transaction.erro_string && (
              <div className="mt-3 flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{transaction.erro_string}</span>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Código da Etapa</label>
                <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                  {transaction.cod_etapa}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Documento Origem</label>
                <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                  {transaction.doc_origem}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Documento Destino</label>
                <p className="font-mono text-sm bg-slate-50 p-2 rounded border">
                  {transaction.doc_destino || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Data/Hora</label>
                <p className="text-sm bg-slate-50 p-2 rounded border">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Permite Reprocessar</label>
                <p className="text-sm bg-slate-50 p-2 rounded border">
                  {transaction.permite_reprocessar ? "Sim" : "Não"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Processado com Sucesso</label>
                <p className="text-sm bg-slate-50 p-2 rounded border">
                  {transaction.processado_sucesso ? "Sim" : "Não"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Descrição</label>
            <p className="text-sm bg-slate-50 p-3 rounded border mt-1">
              {transaction.descricao}
            </p>
          </div>

          {/* Historical Steps - SAP Timeline Style */}
          {transaction.historico && transaction.historico.length > 0 && (
            <div>
              <label className="text-sm font-medium text-slate-600 mb-4 block">
                Histórico de Processamento
              </label>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-0">
                  {transaction.historico.map((step: any, index: number) => {
                    const isLast = index === transaction.historico.length - 1;
                    const isCompleted = step.status === 'done';
                    const isError = step.status === 'error';
                    const isPending = step.status === 'pending';
                    
                    return (
                      <div key={index} className="relative flex items-start gap-4 pb-6">
                        {/* Timeline node */}
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          isCompleted 
                            ? 'bg-green-100 border-green-500' 
                            : isError 
                            ? 'bg-red-100 border-red-500'
                            : 'bg-orange-100 border-orange-500'
                        }`}>
                          {/* Ícones baseados na etapa e status */}
                          {(() => {
                            const etapa = step.etapa.toLowerCase();
                            
                            // Etapas de Captura e Leitura
                            if (etapa.includes('capturado') || etapa.includes('leitura')) {
                              if (isCompleted) return <FileCheck className="w-6 h-6 text-green-600" />;
                              if (isError) return <FileWarning className="w-6 h-6 text-red-600" />;
                              return <FileSearch className="w-6 h-6 text-orange-600" />;
                            }
                            
                            // Etapas de Validação e Verificação
                            if (etapa.includes('validado') || etapa.includes('verif')) {
                              if (isCompleted) return <ShieldCheck className="w-6 h-6 text-green-600" />;
                              if (isError) return <ShieldAlert className="w-6 h-6 text-red-600" />;
                              return <ShieldQuestion className="w-6 h-6 text-orange-600" />;
                            }
                            
                            // Etapas de Publicação e Envio
                            if (etapa.includes('publicado') || etapa.includes('envio')) {
                              if (isCompleted) return <Send className="w-6 h-6 text-green-600" />;
                              if (isError) return <SendHorizonal className="w-6 h-6 text-red-600" />;
                              return <RefreshCw className="w-6 h-6 text-orange-600" />;
                            }
                            
                            // Etapas de Finalização
                            if (etapa.includes('finalizado') || etapa.includes('concluído')) {
                              if (isCompleted) return <CheckCircle2 className="w-6 h-6 text-green-600" />;
                              if (isError) return <XCircle className="w-6 h-6 text-red-600" />;
                              return <Clock className="w-6 h-6 text-orange-600" />;
                            }
                            
                            // Ícone padrão para outras etapas
                            if (isCompleted) return <FileOutput className="w-6 h-6 text-green-600" />;
                            if (isError) return <AlertCircle className="w-6 h-6 text-red-600" />;
                            return <Clock className="w-6 h-6 text-orange-600" />;
                          })()}
                        </div>
                        
                        {/* Step content */}
                        <div className="flex-1 min-w-0">
                          <div className={`p-4 rounded-lg border ${
                            isCompleted 
                              ? 'bg-green-50 border-green-200' 
                              : isError 
                              ? 'bg-red-50 border-red-200'
                              : 'bg-orange-50 border-orange-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{step.etapa}</h4>
                              <Badge 
                                variant="outline" 
                                className={
                                  isCompleted 
                                    ? 'border-green-300 text-green-700 bg-green-50' 
                                    : isError
                                    ? 'border-red-300 text-red-700 bg-red-50'
                                    : 'border-orange-300 text-orange-700 bg-orange-50'
                                }
                              >
                                {isCompleted ? 'Concluído' : isError ? 'Erro' : 'Pendente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(step.data)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Arrow connector */}
                        {!isLast && (
                          <div className="absolute left-6 top-12 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {transaction.permite_reprocessar && (
              <Button 
                variant="outline" 
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reprocessar
              </Button>
            )}
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}