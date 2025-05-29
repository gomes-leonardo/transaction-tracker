import { CheckCircle2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Transaction } from "@/types/transaction"

interface TransactionsTableProps {
  transactions: Transaction[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: () => void
  onDetails: (transaction: Transaction) => void
}

export function TransactionsTable({ 
  transactions, 
  selectedIds, 
  onSelect, 
  onSelectAll,
  onDetails 
}: TransactionsTableProps) {
  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length

  return (
    <div className="rounded-lg border border-[#005F61]/10 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#005F61]/10 bg-[#005F61]/5">
            <th className="w-12 px-4 py-3">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
                className="border-[#005F61]/20"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Código Etapa</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Descrição</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Doc. Origem</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Doc. Destino</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Data/Hora</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#005F61]/70">Status</th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#005F61]/10">
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id}
              className="hover:bg-[#005F61]/5 transition-colors duration-150"
            >
              <td className="px-4 py-3">
                <Checkbox 
                  checked={selectedIds.includes(transaction.id)}
                  onCheckedChange={() => onSelect(transaction.id)}
                  className="border-[#005F61]/20"
                />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-[#005F61]/70">{transaction.cod_etapa}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-[#005F61]/90">{transaction.descricao}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-[#005F61]/70">{transaction.doc_origem}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-[#005F61]/70">{transaction.doc_destino || "—"}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-[#005F61]/70">{transaction.timestamp}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    transaction.processado_sucesso 
                      ? "bg-[#005F61]" 
                      : transaction.erro_string 
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`} />
                  <span className="text-sm text-[#005F61]/70">
                    {transaction.processado_sucesso 
                      ? "Concluído"
                      : transaction.erro_string
                      ? "Erro"
                      : "Processando"
                    }
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDetails(transaction)}
                  className="text-[#005F61]/50 hover:text-[#005F61] hover:bg-[#005F61]/10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 