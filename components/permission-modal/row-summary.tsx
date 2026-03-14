import { AlertTriangle } from "lucide-react"

interface RoleSummaryProps {
  totalPermissions: number
  sensitivePermissions: number
}

export default function RoleSummary({
  totalPermissions,
  sensitivePermissions,
}: RoleSummaryProps) {
  return (
    <div className="bg-surface mr-4 p-4 border border-border rounded-md w-60 h-full shrink-0">
      <h4 className="mb-3 font-bold text-[18px] text-foreground">
        Role Summary
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-block bg-primary rounded-full w-2.5 h-2.5" />
            Total Permissions
          </span>

          <span className="font-semibold text-foreground">
            {String(totalPermissions).padStart(2, "0")}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <AlertTriangle className="fill-yellow-500 size-6 text-white" />
            Sensitive Permissions
          </span>

          <span className="font-semibold text-foreground">
            {String(sensitivePermissions).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}
