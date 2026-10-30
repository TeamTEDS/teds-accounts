"use client"

import type { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy"
import { useEffect, useState } from "react"

import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

export type EmailRow = {
  id: string
  email: string
  type: string
  enabled: number
  createdAt: string
}

const columns: ColumnDef<EmailRow, unknown>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.enabled === 1
            ? "default"
            : row.original.enabled === 0
              ? "destructive"
              : "secondary"
        }
      >
        { row.original.enabled === 1
            ? "True"
            : row.original.enabled === 0
              ? "False"
              : "?"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
]

export function EmailsTable() {
  const [requests, setRequests] = useState<EmailRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadRequests() {
      try {
        const response = await fetch("/api/teds-emails")
        if (!response.ok) {
          throw new Error("Unable to load emails.")
        }

        const body: { requests?: EmailRow[] } = await response.json()
        if (isCurrent) {
          setRequests(body.requests ?? [])
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load emails.",
          )
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    void loadRequests()

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoading) {
    return <div className="rounded-md border p-6 text-center text-muted-foreground">Loading email requests...</div>
  }

  if (error) {
    return <div className="rounded-md border border-destructive/50 p-6 text-center text-destructive">{error}</div>
  }

  return (
    <DataTable
      columns={columns}
      data={requests}
      emptyMessage="No email requests found."
    />
  )
}
