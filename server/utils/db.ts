import type { H3Event } from 'h3'

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
  exec(query: string): Promise<D1ExecResult>
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run<T = unknown>(): Promise<D1Result<T>>
  all<T = unknown>(): Promise<D1Result<T>>
}

export interface D1Result<T = unknown> {
  results?: T[]
  success: boolean
  meta: {
    duration: number
    rows_read: number
    rows_written: number
  }
  error?: string
}

export interface D1ExecResult {
  count: number
  duration: number
}

// Get D1 database instance from event context
export function getDB(event: H3Event): D1Database {
  const db = event.context.cloudflare.env.DB

  console.log('db', db)
  
  if (!db) {
    throw createError({
      status: 500,
      statusText: 'D1 Database not available.'
    })
  }
  
  return db
}

// Helper function to generate UUID
export function generateId(): string {
  return crypto.randomUUID()
}

// Helper to parse JSON fields from D1 results
export function parseJsonField<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

// Helper to stringify JSON fields for D1 insert/update
export function stringifyJsonField(value: any): string | null {
  if (!value) return null
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

// Convert boolean to SQLite integer
export function boolToInt(value: boolean | undefined | null): number {
  return value ? 1 : 0
}

// Convert SQLite integer to boolean
export function intToBool(value: number | undefined | null): boolean {
  return value === 1
}
