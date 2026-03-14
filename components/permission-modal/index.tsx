"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeftRight,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings,
  UserCog,
  UsersRound,
  Wallet,
} from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import PermissionCategorySection from "./permission-category-section"
import RoleSummary from "./row-summary"

//  Data types
interface Permission {
  name: string
  type: string
  sensitivity: "Low" | "Medium" | "High"
}

interface PermissionCategory {
  label: string
  icon: React.ReactNode
  permissions: Permission[]
}

const categories: PermissionCategory[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    permissions: [
      { name: "View Dashboard", type: "Core", sensitivity: "Low" },
      {
        name: "View Primary Balance",
        type: "Financial Visibility",
        sensitivity: "Medium",
      },
      {
        name: "View Product Wallet Balances",
        type: "Financial Visibility",
        sensitivity: "Medium",
      },
      {
        name: "View Transaction Volume Chart",
        type: "Analytics",
        sensitivity: "Low",
      },
      {
        name: "View Transaction Value Chart",
        type: "Analytics",
        sensitivity: "Medium",
      },
      {
        name: "View Success vs Failed Transactions Chart",
        type: "Analytics",
        sensitivity: "Low",
      },
      {
        name: "View Recent Transactions",
        type: "Monitoring",
        sensitivity: "Medium",
      },
      {
        name: "View Transaction Details",
        type: "Monitoring",
        sensitivity: "Medium",
      },
      {
        name: "Use Dashboard Filters",
        type: "Interaction",
        sensitivity: "Low",
      },
      {
        name: "Export Dashboard Data",
        type: "Interaction",
        sensitivity: "Medium",
      },
    ],
  },
  {
    label: "Transactions",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    permissions: [
      { name: "View Transactions Page", type: "Core", sensitivity: "Low" },
      { name: "View Transaction List", type: "Monitoring", sensitivity: "Low" },
      {
        name: "View Transaction Details",
        type: "Monitoring",
        sensitivity: "Medium",
      },
      {
        name: "Export Transactions",
        type: "Interaction",
        sensitivity: "Medium",
      },
      {
        name: "Use Transaction Filters",
        type: "Interaction",
        sensitivity: "Low",
      },
    ],
  },
  {
    label: "Products & Wallet",
    icon: <Wallet className="h-4 w-4" />,
    permissions: [
      { name: "View Products & Wallet Page", type: "Core", sensitivity: "Low" },
      {
        name: "View Product List",
        type: "Financial Visibility",
        sensitivity: "Low",
      },
      {
        name: "View Product Balances",
        type: "Financial Visibility",
        sensitivity: "Medium",
      },
      {
        name: "View Product Performance Metrics",
        type: "Financial Visibility",
        sensitivity: "Low",
      },
      {
        name: "Enable / Disable Product Availability",
        type: "Product Management",
        sensitivity: "Medium",
      },
      { name: "View Product Status", type: "Visibility", sensitivity: "Low" },
      {
        name: "View Settlement Wallet Balance",
        type: "Financial Visibility",
        sensitivity: "High",
      },
      {
        name: "View Pending Withdrawal Requests",
        type: "Financial Visibility",
        sensitivity: "High",
      },
      {
        name: "View Settlement Request History",
        type: "Financial Visibility",
        sensitivity: "Medium",
      },
      {
        name: "Move Product Balance to Settlement Wallet",
        type: "Financial Action",
        sensitivity: "High",
      },
      {
        name: "Create Settlement Withdrawal Request",
        type: "Financial Action",
        sensitivity: "High",
      },
      {
        name: "Cancel Settlement Request",
        type: "Financial Action",
        sensitivity: "Medium",
      },
      { name: "Use Product Filters", type: "Interaction", sensitivity: "Low" },
      {
        name: "Export Product & Wallet Data",
        type: "Interaction",
        sensitivity: "Medium",
      },
    ],
  },
  {
    label: "Customers",
    icon: <UsersRound className="h-4 w-4" />,
    permissions: [
      { name: "View Customers Page", type: "Core", sensitivity: "Low" },
      { name: "View Customer List", type: "Visibility", sensitivity: "Low" },
      {
        name: "View Customer Details",
        type: "Visibility",
        sensitivity: "Medium",
      },
      {
        name: "Export Customer Data",
        type: "Interaction",
        sensitivity: "Medium",
      },
    ],
  },
  {
    label: "Promotions",
    icon: <Megaphone className="h-4 w-4" />,
    permissions: [
      { name: "View Promotions Page", type: "Core", sensitivity: "Low" },
      { name: "Create Promotion", type: "Management", sensitivity: "Medium" },
      { name: "Edit Promotion", type: "Management", sensitivity: "Medium" },
      { name: "Delete Promotion", type: "Management", sensitivity: "High" },
    ],
  },
  {
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    permissions: [
      { name: "View Settings Page", type: "Core", sensitivity: "Low" },
      {
        name: "Edit Company Profile",
        type: "Management",
        sensitivity: "Medium",
      },
      { name: "Manage API Keys", type: "Management", sensitivity: "High" },
    ],
  },
  {
    label: "User Management",
    icon: <UserCog className="h-4 w-4" />,
    permissions: [
      { name: "View User Management Page", type: "Core", sensitivity: "Low" },
      { name: "Invite Users", type: "Management", sensitivity: "Medium" },
      { name: "Edit User Roles", type: "Management", sensitivity: "High" },
      { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      // { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      // { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      // { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      // { name: "Deactivate Users", type: "Management", sensitivity: "High" },
      // { name: "Deactivate Users", type: "Management", sensitivity: "High" },
    ],
  },
]

const sidebarTabs = categories.map((c) => c.label)

interface AddNewRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddNewRoleModal = ({ open, onOpenChange }: AddNewRoleModalProps) => {
  const roleNameId = useId()
  const roleDescriptionId = useId()
  const [step, setStep] = useState<1 | 2>(1)
  const [roleName, setRoleName] = useState("")
  const [description, setDescription] = useState("")
  const [activeTab, setActiveTab] = useState(sidebarTabs[0])
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(
    new Set()
  )
  const [categoryToggles, setCategoryToggles] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [isManualScrolling, setIsManualScrolling] = useState(false)

  // useEffect(() => {
  //   const container = document.querySelector(".permissions-scroll");

  //   const handleScroll = () => {
  //     const offsets = categories.map((cat) => {
  //       const el = document.getElementById(cat.label);

  //       if (!el) return null;

  //       return {
  //         label: cat.label,
  //         top: el.getBoundingClientRect().top,
  //       };
  //     });

  //     const visible = offsets
  //       .filter(Boolean)
  //       .find((o) => o!.top >= 0 && o!.top < 200);

  //     if (visible) {
  //       setActiveTab(visible.label);
  //     }
  //   };

  //   container?.addEventListener("scroll", handleScroll);

  //   return () => container?.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    if (step !== 2) return

    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      if (isManualScrolling) return

      const containerTop = container.getBoundingClientRect().top

      let closest = null
      let minDistance = Infinity

      categories.forEach((cat) => {
        const el = document.getElementById(cat.label.replace(/\s+/g, "-"))
        if (!el) return

        const relativeTop = el.getBoundingClientRect().top - containerTop
        const distance = Math.abs(relativeTop)

        if (distance < minDistance) {
          minDistance = distance
          closest = cat.label
        }
      })

      if (closest) {
        setActiveTab(closest)
      }
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => container.removeEventListener("scroll", handleScroll)
  }, [step, isManualScrolling])

  const handleReset = () => {
    setStep(1)
    setRoleName("")
    setDescription("")
    setActiveTab(sidebarTabs[0])
    setCheckedPermissions(new Set())
    setCategoryToggles(new Set())
    setSearchQuery("")
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) handleReset()
    onOpenChange(val)
  }

  const togglePermission = (key: string) => {
    setCheckedPermissions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleCategory = (label: string) => {
    const cat = categories.find((c) => c.label === label)
    if (!cat) return

    const isEnabled = categoryToggles.has(label)

    setCategoryToggles((prev) => {
      const next = new Set(prev)
      if (isEnabled) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })

    setCheckedPermissions((prev) => {
      const next = new Set(prev)

      cat.permissions.forEach((p) => {
        const key = `${label}::${p.name}`
        if (isEnabled) {
          next.delete(key)
        } else {
          next.add(key)
        }
      })

      return next
    })
  }

  const totalPermissions = useMemo(
    () => checkedPermissions.size,
    [checkedPermissions]
  )

  const sensitivePermissions = useMemo(() => {
    let count = 0
    checkedPermissions.forEach((key) => {
      const [catLabel, permName] = key.split("::")
      const cat = categories.find((c) => c.label === catLabel)
      const perm = cat?.permissions.find((p) => p.name === permName)
      if (perm?.sensitivity === "High") count++
    })
    return count
  }, [checkedPermissions])

  const canProceed = roleName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden bg-card p-0 sm:max-w-7xl">
        {/* Header */}
        <div className="bg-surface flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-bold text-foreground">
            Add New Role
          </DialogTitle>
          <button
            type="button"
            onClick={() => {
              if (step === 1 && canProceed) setStep(2)
              else if (step === 2) {
                // Create role action
                handleOpenChange(false)
              }
            }}
            disabled={step === 1 && !canProceed}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {step === 1 ? "Proceed" : "Create Role"}
          </button>
        </div>

        {/* Stepper */}
        <div className="bg-muted px-6 py-5">
          <div className="mx-auto flex max-w-md items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-start">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  step >= 1 ? "border-primary" : "border-muted-foreground"
                }`}
              >
                {step > 1 ? (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="mt-1.5 text-[14px] font-semibold text-foreground">
                Role Details
              </span>
              <span
                className={`text-[12px] ${step > 1 ? "text-[#16A343]" : "text-[#1B61F5]"} text-left font-medium`}
              >
                {step > 1 ? "Completed" : "In Progress"}
              </span>
            </div>

            {/* Line */}
            <div className="mx-3 -mt-4.5 flex-1">
              <div
                className={`h-[1.5px] ${step > 1 ? "bg-[#FC0606]" : "bg-border"}`}
              />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  step === 2 ? "border-primary" : "border-muted-foreground"
                }`}
              >
                {step === 2 && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="mt-1.5 text-[14px] font-semibold text-foreground">
                Configure Permissions
              </span>
              <span
                className={`text-[12px] font-medium ${step === 2 ? "text-primary" : "text-muted-foreground"}`}
              >
                {step === 2 ? "In Progress" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden bg-card">
          {step === 1 ? (
            <div className="flex w-full justify-center">
              <div className="w-full max-w-lg space-y-5 px-6 py-8">
                <div>
                  <label
                    htmlFor={roleNameId}
                    className="mb-1.5 block text-sm font-semibold text-foreground"
                  >
                    Role Name
                  </label>
                  <Input
                    id={roleNameId}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter Role Name"
                    className="bg-surface placeholder:text-muted-foreground/60"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label
                    htmlFor={roleDescriptionId}
                    className="mb-1.5 block text-sm font-semibold text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id={roleDescriptionId}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex min-h-30 w-full resize-none rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1">
              {/* Sidebar tabs */}
              <div className="bg-surface ml-4 h-full w-57 shrink-0 space-y-2 overflow-y-auto rounded-md border border-border p-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.label}
                    onClick={() => {
                      setIsManualScrolling(true)
                      setActiveTab(cat.label)

                      // document.getElementById(cat.label)?.scrollIntoView({
                      document
                        .getElementById(cat.label.replace(/\s+/g, "-"))
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })

                      setTimeout(() => {
                        setIsManualScrolling(false)
                      }, 500) // wait for scroll to finish
                    }}
                    className={`w-full rounded-md border px-3 py-4 text-left text-sm transition-colors ${
                      activeTab === cat.label
                        ? "border-primary bg-muted/40 font-semibold text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Permissions area */}
              <div
                ref={scrollRef}
                className="bg-surface permissions-scroll mr-4 ml-4 min-h-0 flex-1 overflow-y-auto rounded-md border border-border p-4"
              >
                {/* Search */}
                <div className="relative mx-auto mb-4 max-w-xs">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product..."
                    className="bg-surface pl-9 text-sm placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Categories visible for active tab */}
                {categories.map((cat) => (
                  <PermissionCategorySection
                    key={cat.label}
                    label={cat.label}
                    icon={cat.icon}
                    permissions={cat.permissions}
                    searchQuery={searchQuery}
                    checkedPermissions={checkedPermissions}
                    categoryEnabled={categoryToggles.has(cat.label)}
                    onToggleCategory={() => toggleCategory(cat.label)}
                    onTogglePermission={togglePermission}
                  />
                ))}
                <div className="h-24" />
              </div>

              {/* Role Summary sidebar */}
              <RoleSummary
                totalPermissions={totalPermissions}
                sensitivePermissions={sensitivePermissions}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewRoleModal
