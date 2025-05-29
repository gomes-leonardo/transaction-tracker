import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { MetricCard } from "./MetricCard"

interface MetricsSectionProps {
  total: number
  concluidos: number
  comErros: number
  pendentes: number
}

export function MetricsSection({ total, concluidos, comErros, pendentes }: MetricsSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-[#005F61]">Transaction Tracker</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#005F61]/5 rounded-full">
          <div className="w-1.5 h-1.5 bg-[#005F61] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-[#005F61]/70">Sistema Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total"
          value={total}
          icon={Activity}
          variant="default"
        />
        <MetricCard
          title="Concluídos"
          value={concluidos}
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Com Erros"
          value={comErros}
          icon={AlertCircle}
          variant="error"
        />
        <MetricCard
          title="Pendentes"
          value={pendentes}
          icon={Clock}
          variant="warning"
        />
      </div>
    </div>
  )
} 