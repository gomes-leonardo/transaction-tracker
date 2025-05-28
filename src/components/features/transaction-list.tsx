import { TransactionDisplay } from "@/types/transaction"
import { TransactionCard } from "./transaction-card"
import { FileX2 } from "lucide-react"

interface TransactionListProps {
  transactions: TransactionDisplay[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-slate-50 p-3 mb-4">
          <FileX2 className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium mb-1">
          Nenhuma transação encontrada
        </p>
        <p className="text-sm text-slate-400">
          As transações aparecerão aqui quando forem processadas
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((transaction) => (
        <TransactionCard 
          key={`${transaction.cod_etapa}-${transaction.data.getTime()}`} 
          transaction={transaction} 
        />
      ))}
    </div>
  )
} 