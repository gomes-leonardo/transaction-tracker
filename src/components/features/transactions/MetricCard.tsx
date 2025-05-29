import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  variant: 'default' | 'success' | 'error' | 'warning'
}

const variantStyles = {
  default: {
    bg: 'bg-[#005F61]/5',
    text: 'text-[#005F61]',
    icon: 'text-[#005F61]/70'
  },
  success: {
    bg: 'bg-[#005F61]/5',
    text: 'text-[#005F61]',
    icon: 'text-[#005F61]/70'
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: 'text-red-500/70'
  },
  warning: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: 'text-orange-500/70'
  }
}

export function MetricCard({ title, value, icon: Icon, variant = 'default' }: MetricCardProps) {
  const styles = variantStyles[variant]
  
  return (
    <div className={`rounded-lg ${styles.bg} p-4 transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${styles.text}/70`}>{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${styles.text}`}>{value}</p>
        </div>
        <Icon className={`w-5 h-5 ${styles.icon}`} />
      </div>
    </div>
  )
} 