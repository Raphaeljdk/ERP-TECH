import { createMemoryDb } from './in-memory-db'

type AnyDb = any

let _db: AnyDb = null

function getDb(): AnyDb {
  if (_db) return _db

  // On Vercel, always use in-memory store (SQLite doesn't work on serverless)
  if (process.env.VERCEL) {
    console.log('[DB] Vercel detected — using in-memory store with demo data')
    _db = createMemoryDb()
    return _db
  }

  // Local dev: use Prisma with SQLite
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    const globalForPrisma = globalThis as unknown as { prisma: AnyDb }
    if (globalForPrisma.prisma) {
      _db = globalForPrisma.prisma
    } else {
      _db = new PrismaClient({ log: ['error'] })
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _db
      }
    }
    console.log('[DB] Using Prisma SQLite')
  } catch (e) {
    console.warn('[DB] Prisma unavailable — falling back to in-memory store:', e)
    _db = createMemoryDb()
  }

  return _db
}

// Proxy that lazily initializes and forwards all property accesses
export const db = new Proxy({} as AnyDb, {
  get(_target, prop: string | symbol) {
    if (prop === '__esModule' || typeof prop === 'symbol') return undefined
    const instance = getDb()
    const val = instance[prop]
    if (typeof val === 'function') return val.bind(instance)
    return val
  },
})