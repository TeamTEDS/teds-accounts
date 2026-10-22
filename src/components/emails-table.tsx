"use client"

import type { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy"
import { useEffect, useState } from "react"

import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

type EmailRequestStatus = "pending" | "accepted" | "denied"

export type EmailRequestRow = {
  id: string
  email: string
  usage: string
  primaryEmail: string | null
  reason: string | null
  status: EmailRequestStatus
  createdAt: string
}

const columns: ColumnDef<EmailRequestRow, unknown>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "usage",
    header: "Usage",
  },
  {
    accessorKey: "primaryEmail",
    header: "Primary email",
    cell: ({ row }) => row.original.primaryEmail ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "accepted"
            ? "default"
            : row.original.status === "denied"
              ? "destructive"
              : "secondary"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
]

export function EmailRequestsTable() {
  const [requests, setRequests] = useState<EmailRequestRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadRequests() {
      try {
        const response = await fetch("/api/email-requests")
        if (!response.ok) {
          throw new Error("Unable to load email requests.")
        }

        const body: { requests?: EmailRequestRow[] } = await response.json()
        if (isCurrent) {
          setRequests(body.requests ?? [])
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load email requests.",
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
