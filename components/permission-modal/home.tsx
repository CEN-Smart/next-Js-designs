"use client"

import AddNewRoleModal from "."
import { Button } from "../ui/button"
import { useState } from "react"

export function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add New Role</Button>
      <AddNewRoleModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
