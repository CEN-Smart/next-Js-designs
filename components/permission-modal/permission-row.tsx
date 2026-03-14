import { AlertTriangle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface PermissionRowProps {
  label: string
  type: string
  sensitivity: "Low" | "Medium" | "High"
  checked: boolean
  onToggle: () => void
}

export default function PermissionRow({
  label,
  type,
  sensitivity,
  checked,
  onToggle,
}: PermissionRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="items-center grid grid-cols-[1fr_140px_100px] hover:bg-muted/40 px-1 py-1.5 rounded-md w-full text-muted-foreground text-sm text-left cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${label} permission`}
        />
        <span>{label}</span>
      </div>

      <span>{type}</span>

      <span className="flex items-center gap-1">
        {sensitivity}
        {sensitivity === "High" && (
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        )}
      </span>
    </button>
  )
}
