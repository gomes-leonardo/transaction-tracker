import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-[#005F61]/50" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-9
          pr-4
          py-2
          text-sm
          bg-white
          border
          border-[#005F61]/10
          rounded-lg
          placeholder:text-[#005F61]/40
          text-[#005F61]
          focus:outline-none
          focus:ring-1
          focus:ring-[#005F61]/20
          transition-all
          duration-200
        "
      />
    </div>
  )
} 