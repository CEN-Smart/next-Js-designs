import { ChevronDown, ChevronUp } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Switch } from "../ui/switch"
import PermissionRow from "./permission-row"

interface Permission {
  name: string
  type: string
  sensitivity: "Low" | "Medium" | "High"
}

interface Props {
  label: string
  icon: ReactNode
  permissions: Permission[]
  searchQuery: string
  checkedPermissions: Set<string>
  categoryEnabled: boolean
  onToggleCategory: () => void
  onTogglePermission: (key: string) => void
}

export default function PermissionCategorySection({
  label,
  icon,
  permissions,
  searchQuery,
  checkedPermissions,
  categoryEnabled,
  onToggleCategory,
  onTogglePermission,
}: Props) {
  const [open, setOpen] = useState(true)
  const sectionId = `${label.replace(/\s+/g, "-")}-permissions`

  const filtered = searchQuery
    ? permissions.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : permissions

  return (
    <div id={label.replace(/\s+/g, "-")} className="mb-6 scroll-mt-20">
      {/* Category Header */}
      <div className="flex justify-between items-center bg-card mb-3 p-2 border-border border-b">
        <div className="flex items-center gap-2 font-semibold text-[18px] text-foreground">
          {icon}
          {label}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={categoryEnabled}
            onCheckedChange={onToggleCategory}
          />

          <button
            type="button"
            aria-expanded={open}
            aria-controls={sectionId}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex justify-center items-center"
          >
            {open ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id={sectionId}>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_140px_100px] mb-2 px-1 font-semibold text-foreground text-sm">
            <span>Permissions</span>
            <span>Type</span>
            <span>Sensitivity</span>
          </div>

          {/* Permissions */}
          {filtered.map((perm) => {
            const key = `${label}::${perm.name}`

            return (
              <PermissionRow
                key={key}
                label={perm.name}
                type={perm.type}
                sensitivity={perm.sensitivity}
                checked={checkedPermissions.has(key)}
                onToggle={() => onTogglePermission(key)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
