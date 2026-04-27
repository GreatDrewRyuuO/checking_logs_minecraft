import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { LogEntry, LogsResponse } from "@/types/logs"

interface RawLogRow {
  id: number
  log_type: string
  timestamp: number
  is_archived: 0 | 1
  expires_at: number
  data: string
}

function toNumber(v: unknown): number {
  if (typeof v === "bigint") return Number(v)
  if (typeof v === "number") return v
  return parseInt(String(v), 10) || 0
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10))
    )

    const log_type = searchParams.get("log_type") ?? ""
    const search = searchParams.get("search") ?? ""
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const is_archived = searchParams.get("is_archived")
    const entity_type = searchParams.get("entity_type") ?? ""

    const conditions: string[] = []
    const params: unknown[] = []

    // 🔹 log type
    if (log_type) {
      conditions.push("log_type = ?")
      params.push(log_type)
    }

    // SEARCH
    if (search) {
      const normalized = search.toUpperCase().replace(/\s+/g, "_")
      const like = `%${search}%`
      const likeNorm = `%${normalized}%`

      conditions.push(`
    (
      log_type LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.player_name')) LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.message')) LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.item_type')) LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.entity_type')) LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.block_type')) LIKE ?
      OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.crafted_item')) LIKE ?
    )
  `)

      params.push(
        like, // log_type
        like, // player_name
        like, // message
        likeNorm, // item_type
        likeNorm, // entity_type
        likeNorm, // block_type
        likeNorm // crafted_item
      )
    }

    // 🔹 time range
    if (from) {
      conditions.push("timestamp >= ?")
      params.push(parseInt(from, 10))
    }

    if (to) {
      conditions.push("timestamp <= ?")
      params.push(parseInt(to, 10))
    }

    // 🔹 entity filter (dropdown)
    if (entity_type) {
      conditions.push("JSON_UNQUOTE(JSON_EXTRACT(data, '$.entity_type')) = ?")
      params.push(entity_type)
    }

    // 🔹 archive filter
    if (is_archived === "true") {
      conditions.push("is_archived = 1")
    } else if (is_archived === "false") {
      conditions.push("is_archived = 0")
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    const offset = (page - 1) * pageSize

    // 🔹 total count
    const countRows = await query<Record<string, unknown>>(
      `SELECT COUNT(*) as total FROM ultimate_logs ${where}`,
      [...params]
    )

    const total = toNumber(countRows[0]?.total ?? 0)

    // 🔹 main query
    const rows = await query<RawLogRow>(
      `SELECT id, log_type, timestamp, is_archived, expires_at, data
       FROM ultimate_logs ${where}
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    // 🔹 parse JSON
    const logs: LogEntry[] = rows.map((row) => {
      let parsedData: unknown = row.data

      if (typeof row.data === "string") {
        try {
          parsedData = JSON.parse(row.data)
        } catch {
          parsedData = { raw: row.data }
        }
      }

      return {
        ...row,
        id: toNumber(row.id),
        timestamp: toNumber(row.timestamp),
        expires_at: toNumber(row.expires_at),
        data: parsedData as LogEntry["data"],
      }
    })

    const response: LogsResponse = {
      logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Database error:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        details: String(error),
      },
      { status: 500 }
    )
  }
}
