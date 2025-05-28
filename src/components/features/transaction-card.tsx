import { TransactionDisplay } from "@/types/transaction"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, AlertCircle, Clock, ChevronRight, RotateCw } from "lucide-react"

interface TransactionCardProps {
  transaction: TransactionDisplay
  onReprocess?: (transaction: TransactionDisplay) => void
}

export function TransactionCard({ transaction, onReprocess }: TransactionCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: "text-[#005F61]",
      borderColor: "border-l-[#005F61]",
      bgHover: "hover:bg-[#005F61]/5",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      borderColor: "border-l-red-600",
      bgHover: "hover:bg-red-50",
    },
    waiting: {
      icon: Clock,
      color: "text-amber-500",
      borderColor: "border-l-amber-500",
      bgHover: "hover:bg-amber-50",
    },
  }

  const { icon: StatusIcon, color, borderColor, bgHover } = statusConfig[transaction.status]

  return (
    <div 
      className={`
        group relative flex items-start gap-4 border-l-[3px] bg-white p-4 
        transition-all duration-200 ${borderColor} ${bgHover}
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
      `}
    >
      <StatusIcon className={`h-5 w-5 ${color} shrink-0 mt-0.5`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-slate-900 tracking-tight flex items-center gap-2">
              {transaction.cod_etapa}
              <span className="text-xs text-slate-400 font-normal">
                Seq: {transaction.sequencia}
              </span>
            </h3>
            <time 
              className="text-xs text-slate-400" 
              dateTime={transaction.data.toISOString()}
            >
              {formatDistanceToNow(transaction.data, {
                addSuffix: true,
                locale: ptBR,
              })}
            </time>
          </div>

          {transaction.permite_reprocessar && onReprocess && (
            <button
              onClick={() => onReprocess(transaction)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#005F61] hover:text-[#005F61]/80 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Reprocessar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-medium">Processo:</span>
          <span>{transaction.processo}</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-[10px] text-slate-400">
            {transaction.id_processo}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center text-slate-500">
              <span className="font-medium mr-1.5">Origem:</span>
              <code className="font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                {transaction.doc_origem || '-'}
              </code>
            </div>

            {transaction.doc_destino && (
              <div className="flex items-center text-slate-500">
                <span className="font-medium mr-1.5">Destino:</span>
                <code className="font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                  {transaction.doc_destino}
                </code>
              </div>
            )}
          </div>

          {transaction.erro && (
            <div className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-sm border border-red-100/50">
              {transaction.erro}
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-400" />
    </div>
  )
} 