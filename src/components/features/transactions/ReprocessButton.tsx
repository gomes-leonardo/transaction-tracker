import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReprocessButtonProps {
  count: number
  onClick: () => void
  loading?: boolean
}

export function ReprocessButton({ count, onClick, loading }: ReprocessButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={count === 0 || loading}
      className="
        bg-[#005F61] 
        hover:bg-[#004d61] 
        text-white 
        transition-all 
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        shadow-sm
        hover:shadow-md
      "
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      Reprocessar Selecionados ({count})
    </Button>
  )
} 