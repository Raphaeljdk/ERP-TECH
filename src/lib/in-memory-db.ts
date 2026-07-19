// ============================================================
// In-Memory Database — Prisma-compatible API for Vercel (demo)
// ============================================================

// -------------------- Utilities --------------------

function generateId(): string {
  return Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 10)
}

function daysAgo(days: number, hour?: number, minute?: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour ?? 8 + Math.floor(Math.random() * 10), minute ?? Math.floor(Math.random() * 60), 0, 0)
  return d
}

function todayAt(h: number, m: number = 0): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function dateStr(daysOffset: number = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().slice(0, 10)
}

// -------------------- Types --------------------

type WhereFilter = Record<string, unknown>

interface FindManyArgs {
  where?: WhereFilter
  select?: Record<string, unknown>
  include?: Record<string, unknown>
  orderBy?: Record<string, string> | Array<Record<string, string>>
  skip?: number
  take?: number
}

interface FindUniqueArgs {
  where?: WhereFilter
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

interface FindFirstArgs {
  where?: WhereFilter
  select?: Record<string, unknown>
  include?: Record<string, unknown>
  orderBy?: Record<string, string> | Array<Record<string, string>>
}

interface CountArgs {
  where?: WhereFilter
}

interface CreateArgs {
  data: Record<string, unknown>
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

interface UpdateArgs {
  where: WhereFilter
  data: Record<string, unknown>
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

interface DeleteArgs {
  where: WhereFilter
}

interface AggregateArgs {
  _sum?: Record<string, boolean>
  where?: WhereFilter
}

interface GroupByArgs {
  by: string[]
  _sum?: Record<string, boolean>
  _count?: Record<string, boolean>
  where?: WhereFilter
  orderBy?: Record<string, unknown>
  take?: number
}

interface RelationConfig {
  table: string
  foreignKey: string
  type: 'one' | 'many'
}

// -------------------- Relation Map --------------------

const RELATIONS: Record<string, Record<string, RelationConfig>> = {
  venda: {
    cliente: { table: 'cliente', foreignKey: 'clienteId', type: 'one' },
    itens: { table: 'itemVenda', foreignKey: 'vendaId', type: 'many' },
  },
  itemVenda: {
    venda: { table: 'venda', foreignKey: 'vendaId', type: 'one' },
    produto: { table: 'produto', foreignKey: 'produtoId', type: 'one' },
  },
  produto: {
    categoria: { table: 'categoria', foreignKey: 'categoriaId', type: 'one' },
    movimentacoes: { table: 'movimentacaoEstoque', foreignKey: 'produtoId', type: 'many' },
    itensVenda: { table: 'itemVenda', foreignKey: 'produtoId', type: 'many' },
  },
  cliente: {
    vendas: { table: 'venda', foreignKey: 'clienteId', type: 'many' },
    financeiro: { table: 'financeiro', foreignKey: 'clienteId', type: 'many' },
  },
  categoria: {
    produtos: { table: 'produto', foreignKey: 'categoriaId', type: 'many' },
  },
  financeiro: {
    cliente: { table: 'cliente', foreignKey: 'clienteId', type: 'one' },
  },
  movimentacaoEstoque: {
    produto: { table: 'produto', foreignKey: 'produtoId', type: 'one' },
  },
}

// -------------------- Where Clause Matching --------------------

function matchRecord(record: Record<string, unknown>, where: WhereFilter): boolean {
  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR') {
      const conditions = value as WhereFilter[]
      if (!conditions.some((c) => matchRecord(record, c))) return false
      continue
    }
    if (key === 'AND') {
      const conditions = value as WhereFilter[]
      if (!conditions.every((c) => matchRecord(record, c))) return false
      continue
    }

    const recordValue = record[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const filter = value as Record<string, unknown>

      if ('equals' in filter) {
        if (recordValue !== filter.equals) return false
      }
      if ('contains' in filter) {
        if (typeof recordValue !== 'string' || typeof filter.contains !== 'string') return false
        if (!recordValue.toLowerCase().includes(filter.contains.toLowerCase())) return false
      }
      if ('startsWith' in filter) {
        if (typeof recordValue !== 'string' || typeof filter.startsWith !== 'string') return false
        if (!recordValue.startsWith(filter.startsWith)) return false
      }
      if ('not' in filter) {
        if (filter.not === null) {
          if (recordValue !== null && recordValue !== undefined) return false
        } else if (recordValue === filter.not) return false
      }
      if ('in' in filter) {
        const arr = filter.in as unknown[]
        if (!arr.includes(recordValue)) return false
      }
      if ('gte' in filter) {
        let cmp = filter.gte
        if (recordValue instanceof Date && !(cmp instanceof Date)) cmp = new Date(cmp as string | number)
        else if (!(recordValue instanceof Date) && cmp instanceof Date && typeof recordValue === 'string') {
          cmp = (cmp as Date).toISOString().slice(0, 10)
        }
        if (!(recordValue as number >= cmp as number)) return false
      }
      if ('lte' in filter) {
        let cmp = filter.lte
        if (recordValue instanceof Date && !(cmp instanceof Date)) cmp = new Date(cmp as string | number)
        else if (!(recordValue instanceof Date) && cmp instanceof Date && typeof recordValue === 'string') {
          cmp = (cmp as Date).toISOString().slice(0, 10)
        }
        if (!(recordValue as number <= cmp as number)) return false
      }
      if ('gt' in filter) {
        let cmp = filter.gt
        if (recordValue instanceof Date && !(cmp instanceof Date)) cmp = new Date(cmp as string | number)
        if (!(recordValue as number > cmp as number)) return false
      }
      if ('lt' in filter) {
        let cmp = filter.lt
        if (recordValue instanceof Date && !(cmp instanceof Date)) cmp = new Date(cmp as string | number)
        if (!(recordValue as number < cmp as number)) return false
      }
    } else {
      // Direct equality
      if (recordValue !== value) return false
    }
  }
  return true
}

// -------------------- Sorting --------------------

function sortRecords<T extends Record<string, unknown>>(
  records: T[],
  orderBy: Record<string, string> | Array<Record<string, string>> | undefined
): T[] {
  if (!orderBy) return records
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy]
  return [...records].sort((a, b) => {
    for (const order of orders) {
      for (const [field, direction] of Object.entries(order)) {
        const aVal = a[field]
        const bVal = b[field]
        let cmp = 0
        if (aVal instanceof Date && bVal instanceof Date) {
          cmp = aVal.getTime() - bVal.getTime()
        } else if (typeof aVal === 'string' && typeof bVal === 'string') {
          cmp = aVal.localeCompare(bVal)
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          cmp = aVal - bVal
        } else {
          cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''))
        }
        if (direction === 'desc') cmp = -cmp
        if (cmp !== 0) return cmp
      }
    }
    return 0
  })
}

// -------------------- Include / Select Resolution --------------------

async function resolveRelation(
  record: Record<string, unknown>,
  relationName: string,
  config: RelationConfig,
  db: MemoryDatabase,
  options: Record<string, unknown> = {}
): Promise<unknown> {
  const relatedTable = (db as unknown as Record<string, MemoryTable>)[config.table]
  if (!relatedTable) return config.type === 'one' ? null : []

  const localId = record['id'] as string
  if (!localId) return config.type === 'one' ? null : []

  if (config.type === 'one') {
    const relatedRecords = relatedTable._allRecords().filter(
      (r: Record<string, unknown>) => r[config.foreignKey] === localId
    )
    if (relatedRecords.length === 0) return null
    const result = { ...relatedRecords[0] }

    // Handle nested include/select on the related record
    if (options.include && typeof options.include === 'object' && !Array.isArray(options.include)) {
      const resolved = await resolveIncludes(result, options.include as Record<string, unknown>, config.table, db)
      Object.assign(result, resolved)
    } else if (options.select && typeof options.select === 'object' && !Array.isArray(options.select)) {
      return applyProjection(result, options.select as Record<string, unknown>, config.table, db)
    }
    return result
  } else {
    let relatedRecords = relatedTable._allRecords().filter(
      (r: Record<string, unknown>) => r[config.foreignKey] === localId
    )

    // Handle orderBy on the relation
    if (options.orderBy) {
      relatedRecords = sortRecords(
        relatedRecords,
        options.orderBy as Record<string, string> | Array<Record<string, string>>
      )
    }

    // Handle take on the relation
    if (options.take !== undefined) {
      relatedRecords = relatedRecords.slice(0, options.take as number)
    }

    // Handle nested include/select
    if (options.include && typeof options.include === 'object' && !Array.isArray(options.include)) {
      const results: Record<string, unknown>[] = []
      for (const r of relatedRecords) {
        const copy = { ...r }
        const resolved = await resolveIncludes(copy, options.include as Record<string, unknown>, config.table, db)
        results.push({ ...copy, ...resolved })
      }
      return results
    } else if (options.select && typeof options.select === 'object' && !Array.isArray(options.select)) {
      const results: unknown[] = []
      for (const r of relatedRecords) {
        results.push(applyProjection(r, options.select as Record<string, unknown>, config.table, db))
      }
      return results
    }

    return relatedRecords
  }
}

async function resolveIncludes(
  record: Record<string, unknown>,
  include: Record<string, unknown>,
  tableName: string,
  db: MemoryDatabase
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {}
  const tableRelations = RELATIONS[tableName] || {}

  for (const [key, value] of Object.entries(include)) {
    if (key === '_count') {
      // Handle _count: { select: { produtos: true } }
      const countValue = value as Record<string, unknown>
      // Prisma sends { select: { field: true } }, handle both forms
      const countSelect = (countValue.select || countValue) as Record<string, unknown>
      const counts: Record<string, number> = {}
      for (const [relName] of Object.entries(countSelect)) {
        const relConfig = tableRelations[relName]
        if (relConfig) {
          const relatedTable = (db as unknown as Record<string, MemoryTable>)[relConfig.table]
          if (relatedTable) {
            const localId = record['id'] as string
            counts[relName] = relatedTable._allRecords().filter(
              (r: Record<string, unknown>) => r[relConfig.foreignKey] === localId
            ).length
          }
        }
      }
      result._count = counts
      continue
    }

    if (typeof value === 'boolean' && value === true) {
      const relConfig = tableRelations[key]
      if (relConfig) {
        result[key] = await resolveRelation(record, key, relConfig, db)
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const relConfig = tableRelations[key]
      if (relConfig) {
        result[key] = await resolveRelation(record, key, relConfig, db, value as Record<string, unknown>)
      }
    }
  }

  return result
}

function applyProjection(
  record: Record<string, unknown>,
  select: Record<string, unknown>,
  tableName: string,
  db: MemoryDatabase
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const tableRelations = RELATIONS[tableName] || {}

  for (const [key, value] of Object.entries(select)) {
    if (key === '_count') {
      const countValue = value as Record<string, unknown>
      const countSelect = (countValue.select || countValue) as Record<string, unknown>
      const counts: Record<string, number> = {}
      for (const [relName] of Object.entries(countSelect)) {
        const relConfig = tableRelations[relName]
        if (relConfig) {
          const relatedTable = (db as unknown as Record<string, MemoryTable>)[relConfig.table]
          if (relatedTable) {
            const localId = record['id'] as string
            counts[relName] = relatedTable._allRecords().filter(
              (r: Record<string, unknown>) => r[relConfig.foreignKey] === localId
            ).length
          }
        }
      }
      result._count = counts
      continue
    }

    if (typeof value === 'boolean' && value === true) {
      const relConfig = tableRelations[key]
      if (relConfig) {
        // This is a relation field with `true` in select
        // We need to resolve the relation and include it
        const relatedTable = (db as unknown as Record<string, MemoryTable>)[relConfig.table]
        if (relatedTable) {
          const localId = record['id'] as string
          if (relConfig.type === 'one') {
            const relatedRecords = relatedTable._allRecords().filter(
              (r: Record<string, unknown>) => r[relConfig.foreignKey] === localId
            )
            result[key] = relatedRecords.length > 0 ? { ...relatedRecords[0] } : null
          } else {
            result[key] = relatedTable
              ._allRecords()
              .filter((r: Record<string, unknown>) => r[relConfig.foreignKey] === localId)
          }
        }
      } else {
        result[key] = record[key]
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const relConfig = tableRelations[key]
      if (relConfig) {
        // Relation with nested select
        const relatedTable = (db as unknown as Record<string, MemoryTable>)[relConfig.table]
        if (relatedTable) {
          const localId = record['id'] as string
          const relatedRecords = relatedTable._allRecords().filter(
            (r: Record<string, unknown>) => r[relConfig.foreignKey] === localId
          )
          if (relConfig.type === 'one') {
            if (relatedRecords.length > 0) {
              result[key] = applyProjection(
                relatedRecords[0],
                value as Record<string, unknown>,
                relConfig.table,
                db
              )
            } else {
              result[key] = null
            }
          } else {
            result[key] = relatedRecords.map((r) =>
              applyProjection(r, value as Record<string, unknown>, relConfig.table, db)
            )
          }
        }
      }
    }
  }

  return result
}

// -------------------- MemoryTable --------------------

class MemoryTable<T extends Record<string, unknown> = Record<string, unknown>> {
  private store: Map<string, T> = new Map()
  public tableName: string
  private db: MemoryDatabase

  constructor(tableName: string, db: MemoryDatabase) {
    this.tableName = tableName
    this.db = db
  }

  _allRecords(): T[] {
    return Array.from(this.store.values())
  }

  _findById(id: string): T | undefined {
    return this.store.get(id)
  }

  _insert(record: T): void {
    this.store.set(record.id as string, { ...record })
  }

  _update(id: string, data: Partial<T>): T | undefined {
    const existing = this.store.get(id)
    if (!existing) return undefined
    const updated = { ...existing, ...data, updatedAt: new Date() }
    this.store.set(id, updated as T)
    return updated
  }

  _remove(id: string): T | undefined {
    const record = this.store.get(id)
    if (record) this.store.delete(id)
    return record
  }

  async findMany(args: FindManyArgs = {}): Promise<T[]> {
    let records = this._allRecords()

    // Filter
    if (args.where) {
      records = records.filter((r) => matchRecord(r, args.where!))
    }

    // Sort
    records = sortRecords(records, args.orderBy)

    // Paginate
    if (args.skip) records = records.slice(args.skip)
    if (args.take) records = records.slice(0, args.take)

    // Apply select or include
    if (args.select) {
      return records.map((r) =>
        applyProjection({ ...r }, args.select!, this.tableName, this.db) as T
      )
    }

    if (args.include) {
      const results: T[] = []
      for (const r of records) {
        const copy = { ...r }
        const resolved = await resolveIncludes(copy, args.include!, this.tableName, this.db)
        results.push({ ...copy, ...resolved } as T)
      }
      return results
    }

    return records.map((r) => ({ ...r }))
  }

  async findUnique(args: FindUniqueArgs = {}): Promise<T | null> {
    const records = this._allRecords()
    let result: T | null = null

    if (args.where) {
      result = records.find((r) => matchRecord(r, args.where!)) || null
    }

    if (!result) return null

    const copy = { ...result }

    if (args.select) {
      return applyProjection(copy, args.select, this.tableName, this.db) as T
    }

    if (args.include) {
      const resolved = await resolveIncludes(copy, args.include, this.tableName, this.db)
      return { ...copy, ...resolved } as T
    }

    return copy
  }

  async findFirst(args: FindFirstArgs = {}): Promise<T | null> {
    let records = this._allRecords()

    if (args.where) {
      records = records.filter((r) => matchRecord(r, args.where!))
    }

    records = sortRecords(records, args.orderBy)

    if (records.length === 0) return null
    const copy = { ...records[0] }

    if (args.select) {
      return applyProjection(copy, args.select!, this.tableName, this.db) as T
    }

    if (args.include) {
      const resolved = await resolveIncludes(copy, args.include!, this.tableName, this.db)
      return { ...copy, ...resolved } as T
    }

    return copy
  }

  async count(args: CountArgs = {}): Promise<number> {
    let records = this._allRecords()
    if (args.where) {
      records = records.filter((r) => matchRecord(r, args.where!))
    }
    return records.length
  }

  async create(args: CreateArgs): Promise<T> {
    const now = new Date()
    const id = generateId()
    const record: Record<string, unknown> = {
      ...args.data,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Handle nested create (e.g., itens: { create: [...] })
    const nestedCreates: Record<string, unknown[]> = {}
    for (const [key, value] of Object.entries(args.data)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        'create' in (value as Record<string, unknown>)
      ) {
        nestedCreates[key] = (value as { create: unknown[] }).create as unknown[]
        delete record[key]
      }
    }

    // Insert the main record
    const typedRecord = record as T
    this.store.set(id, typedRecord)

    // Handle nested creates
    for (const [relationName, items] of Object.entries(nestedCreates)) {
      const relConfig = RELATIONS[this.tableName]?.[relationName]
      if (relConfig && relConfig.type === 'many') {
        const relatedTable = (this.db as unknown as Record<string, MemoryTable>)[relConfig.table]
        if (relatedTable) {
          for (const item of items) {
            const itemData = item as Record<string, unknown>
            const nestedId = generateId()
            const nestedRecord = {
              ...itemData,
              id: nestedId,
              [relConfig.foreignKey]: id,
              createdAt: now,
              updatedAt: now,
            }
            // Add createdAt if not present (for ItemVenda)
            if (!nestedRecord.createdAt && this.tableName === 'venda') {
              nestedRecord.createdAt = now
            }
            relatedTable._insert(nestedRecord as any)
          }
        }
      }
    }

    // Return with includes/select if requested
    const copy = { ...typedRecord }

    if (args.select) {
      return applyProjection(copy, args.select, this.tableName, this.db) as T
    }

    if (args.include) {
      const resolved = await resolveIncludes(copy, args.include, this.tableName, this.db)
      return { ...copy, ...resolved } as T
    }

    return copy
  }

  async update(args: UpdateArgs): Promise<T> {
    const records = this._allRecords()
    const existing = args.where
      ? records.find((r) => matchRecord(r, args.where))
      : null

    if (!existing) {
      throw new Error(`Record not found in ${this.tableName}`)
    }

    const updateData: Record<string, unknown> = { ...args.data, updatedAt: new Date() }

    // Remove undefined values
    for (const [key, val] of Object.entries(updateData)) {
      if (val === undefined) delete updateData[key]
    }

    const updated = this._update(existing.id as string, updateData as Partial<T>)!
    const copy = { ...updated }

    if (args.select) {
      return applyProjection(copy, args.select, this.tableName, this.db) as T
    }

    if (args.include) {
      const resolved = await resolveIncludes(copy, args.include, this.tableName, this.db)
      return { ...copy, ...resolved } as T
    }

    return copy
  }

  async delete(args: DeleteArgs): Promise<T> {
    const records = this._allRecords()
    const existing = args.where
      ? records.find((r) => matchRecord(r, args.where))
      : null

    if (!existing) {
      throw new Error(`Record not found in ${this.tableName}`)
    }

    this._remove(existing.id as string)
    return { ...existing }
  }

  async aggregate(args: AggregateArgs): Promise<{ _sum: Record<string, number | null> }> {
    let records = this._allRecords()
    if (args.where) {
      records = records.filter((r) => matchRecord(r, args.where))
    }

    const sums: Record<string, number | null> = {}
    if (args._sum) {
      for (const field of Object.keys(args._sum)) {
        if (records.length === 0) {
          sums[field] = null
        } else {
          sums[field] = records.reduce((acc, r) => acc + ((r[field] as number) || 0), 0)
        }
      }
    }

    return { _sum: sums }
  }

  async groupBy(args: GroupByArgs): Promise<Record<string, unknown>[]> {
    let records = this._allRecords()
    if (args.where) {
      records = records.filter((r) => matchRecord(r, args.where))
    }

    // Group by the specified fields
    const groups = new Map<string, Record<string, unknown>[]>()

    for (const record of records) {
      const keyValues = args.by.map((field) => String(record[field] ?? ''))
      const key = keyValues.join('|||')

      if (!groups.has(key)) {
        const groupKey: Record<string, unknown> = {}
        for (const field of args.by) {
          groupKey[field] = record[field]
        }
        groups.set(key, [])
      }
      groups.get(key)!.push(record)
    }

    // Build result for each group
    let results: Record<string, unknown>[] = []

    for (const [key, groupRecords] of groups) {
      const groupKeyValues = key.split('|||')
      const result: Record<string, unknown> = {}

      for (let i = 0; i < args.by.length; i++) {
        result[args.by[i]] = groupRecords[0][args.by[i]]
      }

      if (args._sum) {
        const sums: Record<string, number | null> = {}
        for (const field of Object.keys(args._sum)) {
          sums[field] = groupRecords.reduce((acc, r) => acc + ((r[field] as number) || 0), 0)
        }
        result._sum = sums
      }

      if (args._count) {
        const counts: Record<string, number> = {}
        for (const field of Object.keys(args._count)) {
          counts[field] = groupRecords.length
        }
        result._count = counts
      }

      results.push(result)
    }

    // Sort
    if (args.orderBy) {
      // Handle _sum ordering: { _sum: { total: 'desc' } }
      if ('_sum' in args.orderBy) {
        const sumOrder = args.orderBy._sum as Record<string, string>
        for (const [field, direction] of Object.entries(sumOrder)) {
          results.sort((a, b) => {
            const aVal = ((a._sum as Record<string, unknown>)?.[field] as number) || 0
            const bVal = ((b._sum as Record<string, unknown>)?.[field] as number) || 0
            return direction === 'desc' ? bVal - aVal : aVal - bVal
          })
        }
      } else {
        results = sortRecords(results, args.orderBy as Record<string, string>)
      }
    }

    // Take
    if (args.take) {
      results = results.slice(0, args.take)
    }

    return results
  }
}

// -------------------- MemoryDatabase --------------------

class MemoryDatabase {
  cliente: MemoryTable
  produto: MemoryTable
  venda: MemoryTable
  itemVenda: MemoryTable
  movimentacaoEstoque: MemoryTable
  financeiro: MemoryTable
  categoria: MemoryTable

  constructor() {
    this.cliente = new MemoryTable('cliente', this)
    this.produto = new MemoryTable('produto', this)
    this.venda = new MemoryTable('venda', this)
    this.itemVenda = new MemoryTable('itemVenda', this)
    this.movimentacaoEstoque = new MemoryTable('movimentacaoEstoque', this)
    this.financeiro = new MemoryTable('financeiro', this)
    this.categoria = new MemoryTable('categoria', this)
  }

  async $queryRawUnsafe(sql: string, ...params: unknown[]): Promise<unknown[]> {
    // Substitute $N placeholders (from highest to lowest to avoid $1 matching $10)
    let normalizedSql = sql
    for (let i = params.length - 1; i >= 0; i--) {
      const value = params[i]
      const placeholder = new RegExp(`\\$${i + 1}(?![0-9])`, 'g')
      if (typeof value === 'string') {
        normalizedSql = normalizedSql.replace(placeholder, `'${value.replace(/'/g, "''")}'`)
      } else if (typeof value === 'number') {
        normalizedSql = normalizedSql.replace(placeholder, String(value))
      } else if (value instanceof Date) {
        normalizedSql = normalizedSql.replace(placeholder, `'${value.toISOString()}'`)
      } else {
        normalizedSql = normalizedSql.replace(placeholder, String(value))
      }
    }

    const isCountQuery = /SELECT\s+COUNT\(\*\)\s+as\s+count/i.test(normalizedSql)
    const isProdutoTable = /FROM\s+"?Produto"?(?:\s|$|;)/i.test(normalizedSql) || /FROM\s+"?Produto"?\s+p/i.test(normalizedSql)
    const hasJoinCategoria = /JOIN\s+"Categoria"/i.test(normalizedSql)
    const hasLowStock = /"estoqueAtual"\s*<=\s*"estoqueMinimo"/i.test(normalizedSql)

    if (!isProdutoTable) {
      console.warn('[in-memory-db] $queryRawUnsupported table:', normalizedSql.slice(0, 100))
      return []
    }

    // Extract WHERE clause
    const whereMatch = normalizedSql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+|\s+LIMIT\s+|\s*$)/is)
    let whereClause = whereMatch ? whereMatch[1].trim() : ''

    // Start with all produto records
    let records = this.produto._allRecords().map((r) => ({ ...r }))

    // Apply low stock filter
    if (hasLowStock) {
      records = records.filter((r) => (r.estoqueAtual as number) <= (r.estoqueMinimo as number))
      // Remove the low stock condition from the clause
      whereClause = whereClause
        .replace(/"?p"?\.?"estoqueAtual"\s*<=\s*"?p"?\.?"estoqueMinimo"/gi, '')
        .replace(/\(\s*\)/g, '')
        .replace(/\s*AND\s*AND\s*/g, ' AND ')
        .replace(/^\s*AND\s+/, '')
        .trim()
    }

    // Parse and apply remaining conditions
    if (whereClause) {
      // Remove table alias prefix (p."field" -> "field" or just field)
      let cleanedClause = whereClause.replace(/p\./g, '').replace(/"/g, '')

      // Handle OR group: (nome LIKE '%x%' OR codigo LIKE '%x%' OR ...)
      const orGroupMatch = cleanedClause.match(/\(([^)]+)\)/)
      if (orGroupMatch) {
        const orConditions = orGroupMatch[1]
        const likeMatches = orConditions.matchAll(/(\w+)\s+LIKE\s+'([^']*)'/gi)
        const searchTerms: Array<{ field: string; pattern: string }> = []
        for (const m of likeMatches) {
          let pattern = m[2] as string
          const isContains = pattern.startsWith('%') && pattern.endsWith('%')
          const isStartsWith = pattern.endsWith('%') && !pattern.startsWith('%')
          if (isContains) pattern = pattern.slice(1, -1)
          else if (isStartsWith) pattern = pattern.slice(0, -1)
          else continue
          searchTerms.push({ field: m[1], pattern, isContains })
        }

        if (searchTerms.length > 0) {
          records = records.filter((r) =>
            searchTerms.some((st) => {
              const val = String(r[st.field] ?? '').toLowerCase()
              const search = st.pattern.toLowerCase()
              return val.includes(search)
            })
          )
        }

        // Remove the OR group from the clause
        cleanedClause = cleanedClause.replace(orGroupMatch[0], '').trim()
        cleanedClause = cleanedClause.replace(/^\s*AND\s+/, '').replace(/\s+AND\s*$/, '').trim()
      }

      // Handle simple equality conditions: field = 'value'
      const eqConditions = cleanedClause.matchAll(/(\w+)\s*=\s*'([^']*)'/g)
      for (const m of eqConditions) {
        const field = m[1] as string
        const value = m[2] as string
        records = records.filter((r) => r[field] === value)
      }

      // Handle simple equality with numbers: field = 123
      const numEqConditions = cleanedClause.matchAll(/(\w+)\s*=\s*(\d+(?:\.\d+)?)/g)
      for (const m of numEqConditions) {
        const field = m[1] as string
        const value = parseFloat(m[2] as string)
        records = records.filter((r) => r[field] === value)
      }
    }

    // Apply ORDER BY
    const orderMatch = normalizedSql.match(/ORDER\s+BY\s+(?:p\.)?(\w+)\s+(ASC|DESC)/i)
    if (orderMatch) {
      const field = orderMatch[1] === 'nome' ? 'nome' : orderMatch[1]
      const dir = (orderMatch[2] as string).toLowerCase() === 'asc' ? 1 : -1
      records.sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        if (typeof aVal === 'number' && typeof bVal === 'number') return dir * (aVal - bVal)
        return dir * String(aVal ?? '').localeCompare(String(bVal ?? ''))
      })
    }

    // COUNT query
    if (isCountQuery) {
      return [{ count: records.length }]
    }

    // Apply LIMIT and OFFSET
    const limitMatch = normalizedSql.match(/LIMIT\s+(\d+)/i)
    const offsetMatch = normalizedSql.match(/OFFSET\s+(\d+)/i)
    const limit = limitMatch ? parseInt(limitMatch[1]) : records.length
    const offset = offsetMatch ? parseInt(offsetMatch[1]) : 0
    records = records.slice(offset, offset + limit)

    // Handle JOIN with Categoria
    if (hasJoinCategoria) {
      return records.map((r) => {
        const cat = r.categoriaId
          ? this.categoria._findById(r.categoriaId as string)
          : null
        return {
          ...r,
          cat_id: cat?.id ?? null,
          cat_nome: cat?.nome ?? null,
          cat_descricao: cat?.descricao ?? null,
        }
      })
    }

    // Handle SELECT with aliases (dashboard query)
    const selectClause = normalizedSql.match(/SELECT\s+(.+?)\s+FROM/i)
    if (selectClause) {
      const selectStr = selectClause[1]
      if (selectStr.includes('as estoque')) {
        return records.map((r) => ({
          id: r.id,
          nome: r.nome,
          estoque: r.estoqueAtual,
          estoqueMinimo: r.estoqueMinimo,
        }))
      }
    }

    return records
  }

  async $transaction(
    fnOrPromises: ((tx: MemoryDatabase) => Promise<unknown>) | Promise<unknown>[]
  ): Promise<unknown> {
    if (Array.isArray(fnOrPromises)) {
      return Promise.all(fnOrPromises)
    }
    return fnOrPromises(this)
  }
}

// -------------------- Seed Data --------------------

function seedData(db: MemoryDatabase): void {
  const now = new Date()

  // ==================== Categorias ====================
  const categorias = [
    { id: generateId(), nome: 'Computadores', descricao: 'Notebooks, desktops e estações de trabalho', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
    { id: generateId(), nome: 'Periféricos', descricao: 'Teclados, mouses, monitores e webcams', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
    { id: generateId(), nome: 'Componentes', descricao: 'Placas de vídeo, memórias, SSDs e fontes', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
    { id: generateId(), nome: 'Acessórios', descricao: 'Hub USB, cabos e adaptadores', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
    { id: generateId(), nome: 'Redes', descricao: 'Roteadores, switches e equipamentos de rede', createdAt: daysAgo(60), updatedAt: daysAgo(60) },
  ]
  for (const c of categorias) db.categoria._insert(c)
  const catMap = new Map(categorias.map((c) => [c.nome, c.id]))

  // ==================== Produtos ====================
  const produtos = [
    { id: generateId(), codigo: 'NB-DELL-15', nome: 'Notebook Dell Inspiron 15', descricao: 'Intel i7, 16GB RAM, 512GB SSD, Tela 15.6" Full HD', precoCusto: 3200, precoVenda: 4299, estoqueAtual: 12, estoqueMinimo: 5, categoriaId: catMap.get('Computadores')!, codigoBarras: '7891234567001', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(45), updatedAt: daysAgo(10) },
    { id: generateId(), codigo: 'DT-GAMER-4060', nome: 'Desktop Gamer RTX 4060', descricao: 'AMD Ryzen 7, 32GB DDR5, RTX 4060 8GB, 1TB NVMe', precoCusto: 5900, precoVenda: 7899, estoqueAtual: 3, estoqueMinimo: 5, categoriaId: catMap.get('Computadores')!, codigoBarras: '7891234567018', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(40), updatedAt: daysAgo(5) },
    { id: generateId(), codigo: 'MON-LG-274K', nome: 'Monitor LG UltraFine 27" 4K', descricao: 'IPS, 4K UHD, USB-C, HDR400, 60Hz', precoCusto: 1650, precoVenda: 2199, estoqueAtual: 8, estoqueMinimo: 3, categoriaId: catMap.get('Periféricos')!, codigoBarras: '7891234567025', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(38), updatedAt: daysAgo(12) },
    { id: generateId(), codigo: 'TEC-MEC-RGB', nome: 'Teclado Mecânico RGB HyperX', descricao: 'Switches Red, Full-Size, Iluminação RGB, Anti-Ghost', precoCusto: 220, precoVenda: 349, estoqueAtual: 25, estoqueMinimo: 5, categoriaId: catMap.get('Periféricos')!, codigoBarras: '7891234567032', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(35), updatedAt: daysAgo(20) },
    { id: generateId(), codigo: 'MOU-LOGI-MX3', nome: 'Mouse Logitech MX Master 3S', descricao: 'Bluetooth + USB, Recarregável, Sensor 8000 DPI', precoCusto: 380, precoVenda: 599, estoqueAtual: 15, estoqueMinimo: 5, categoriaId: catMap.get('Periféricos')!, codigoBarras: '7891234567049', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(35), updatedAt: daysAgo(15) },
    { id: generateId(), codigo: 'CAM-FHD-1080', nome: 'Webcam Logitech C920 Full HD', descricao: '1080p, Autofoco, Microfone Integrado, USB', precoCusto: 190, precoVenda: 289, estoqueAtual: 2, estoqueMinimo: 5, categoriaId: catMap.get('Periféricos')!, codigoBarras: '7891234567056', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(30), updatedAt: daysAgo(3) },
    { id: generateId(), codigo: 'SSD-KING-1T', nome: 'SSD Kingston NV2 1TB NVMe', descricao: 'PCIe 4.0 NVMe, Leitura 3500MB/s, M.2 2280', precoCusto: 310, precoVenda: 459, estoqueAtual: 30, estoqueMinimo: 10, categoriaId: catMap.get('Componentes')!, codigoBarras: '7891234567063', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(28), updatedAt: daysAgo(7) },
    { id: generateId(), codigo: 'RAM-DDR5-16', nome: 'Memória RAM Corsair Vengeance DDR5 16GB', descricao: '4800MHz, CL40, Un módulo, Desktop', precoCusto: 260, precoVenda: 389, estoqueAtual: 4, estoqueMinimo: 5, categoriaId: catMap.get('Componentes')!, codigoBarras: '7891234567070', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(28), updatedAt: daysAgo(4) },
    { id: generateId(), codigo: 'FONTE-600W', nome: 'Fonte Corsair CV600 600W', descricao: '80 Plus Bronze, Modular, 120mm Fan', precoCusto: 210, precoVenda: 329, estoqueAtual: 18, estoqueMinimo: 5, categoriaId: catMap.get('Componentes')!, codigoBarras: '7891234567087', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(25), updatedAt: daysAgo(18) },
    { id: generateId(), codigo: 'PV-RTX4070', nome: 'Placa de Vídeo MSI RTX 4070 Ventus', descricao: '12GB GDDR6X, Tri-Fan, Overclocked', precoCusto: 2900, precoVenda: 3899, estoqueAtual: 5, estoqueMinimo: 3, categoriaId: catMap.get('Componentes')!, codigoBarras: '7891234567094', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(22), updatedAt: daysAgo(8) },
    { id: generateId(), codigo: 'HEAD-HYPERX', nome: 'Headset Gamer HyperX Cloud Stinger 2', descricao: '7.1 Surround, Microfone Giratório, 53mm Drivers', precoCusto: 290, precoVenda: 449, estoqueAtual: 20, estoqueMinimo: 5, categoriaId: catMap.get('Periféricos')!, codigoBarras: '7891234567100', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(20), updatedAt: daysAgo(14) },
    { id: generateId(), codigo: 'HUB-USBC-7P', nome: 'Hub USB-C Anker 7 Portas', descricao: 'USB-C PD 100W, HDMI 4K, Ethernet, SD/TF', precoCusto: 110, precoVenda: 189, estoqueAtual: 3, estoqueMinimo: 5, categoriaId: catMap.get('Acessórios')!, codigoBarras: '7891234567117', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(18), updatedAt: daysAgo(6) },
    { id: generateId(), codigo: 'SWITCH-16P', nome: 'Switch Gerenciável TP-Link 16 Portas', descricao: 'Gigabit, 16 Portas, Rack 19", Layer 2+', precoCusto: 900, precoVenda: 1299, estoqueAtual: 7, estoqueMinimo: 3, categoriaId: catMap.get('Redes')!, codigoBarras: '7891234567124', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(15), updatedAt: daysAgo(10) },
    { id: generateId(), codigo: 'CAB-CAT6-5M', nome: 'Cabo Ethernet Cat6 UTP 5m', descricao: 'Cat6, UTP, 5 metros, RJ45, Azul', precoCusto: 18, precoVenda: 49, estoqueAtual: 50, estoqueMinimo: 10, categoriaId: catMap.get('Redes')!, codigoBarras: '7891234567131', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(12), updatedAt: daysAgo(30) },
    { id: generateId(), codigo: 'ROT-WIFI6', nome: 'Roteador TP-Link Archer AX73 Wi-Fi 6', descricao: 'AX5400, 6 Antenas, Gigabit, MU-MIMO', precoCusto: 480, precoVenda: 699, estoqueAtual: 10, estoqueMinimo: 3, categoriaId: catMap.get('Redes')!, codigoBarras: '7891234567148', unidade: 'UN', status: 'ATIVO', createdAt: daysAgo(10), updatedAt: daysAgo(5) },
  ]
  for (const p of produtos) db.produto._insert(p)
  const prodMap = new Map(produtos.map((p) => [p.codigo, p.id]))
  const prodByCode = new Map(produtos.map((p) => [p.codigo, p]))

  // ==================== Clientes ====================
  const clientes = [
    { id: generateId(), nome: 'Carlos Eduardo Silva', cpf: '123.456.789-00', email: 'carlos.silva@email.com', telefone: '(11) 3456-7890', celular: '(11) 98765-4321', dataNascimento: '1985-03-15', cep: '01310-100', logradouro: 'Av. Paulista', numero: '1578', complemento: 'Sala 1204', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', status: 'ATIVO', limiteCredito: 15000, createdAt: daysAgo(90), updatedAt: daysAgo(5) },
    { id: generateId(), nome: 'Maria Fernanda Costa', cpf: '234.567.890-11', email: 'maria.costa@empresa.com', telefone: '(21) 2345-6789', celular: '(21) 99876-5432', dataNascimento: '1990-07-22', cep: '20040-020', logradouro: 'Rua do Ouvidor', numero: '72', complemento: 'Cj. 302', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', status: 'ATIVO', limiteCredito: 20000, createdAt: daysAgo(85), updatedAt: daysAgo(3) },
    { id: generateId(), nome: 'João Pedro Santos', cpf: '345.678.901-22', email: 'joao.santos@techcorp.com', telefone: '(31) 3456-1234', celular: '(31) 97654-3210', dataNascimento: '1988-11-08', cep: '30130-000', logradouro: 'Av. Afonso Pena', numero: '2450', complemento: '10º andar', bairro: 'Centro', cidade: 'Belo Horizonte', estado: 'MG', status: 'ATIVO', limiteCredito: 10000, createdAt: daysAgo(75), updatedAt: daysAgo(10) },
    { id: generateId(), nome: 'Ana Clara Oliveira', cpf: '456.789.012-33', email: 'ana.oliveira@mail.com', telefone: '(41) 3321-4567', celular: '(41) 96543-2109', dataNascimento: '1995-05-30', cep: '80020-310', logradouro: 'Rua XV de Novembro', numero: '189', complemento: '', bairro: 'Centro', cidade: 'Curitiba', estado: 'PR', status: 'ATIVO', limiteCredito: 8000, createdAt: daysAgo(60), updatedAt: daysAgo(8) },
    { id: generateId(), nome: 'Rafael Almeida Souza', cpf: '567.890.123-44', email: 'rafael.souza@startup.io', telefone: '(51) 3222-3344', celular: '(51) 99123-4567', dataNascimento: '1992-09-12', cep: '90020-020', logradouro: 'Rua da Praia', numero: '85', complemento: 'Sala 501', bairro: 'Centro Histórico', cidade: 'Porto Alegre', estado: 'RS', status: 'ATIVO', limiteCredito: 25000, createdAt: daysAgo(50), updatedAt: daysAgo(2) },
    { id: generateId(), nome: 'Juliana Rodrigues Lima', cpf: '678.901.234-55', email: 'juliana.lima@advocacia.com', telefone: '(61) 3321-9876', celular: '(61) 98765-0987', dataNascimento: '1983-12-03', cep: '70040-010', logradouro: 'SQS 308 Bloco A', numero: '204', complemento: '', bairro: 'Asa Sul', cidade: 'Brasília', estado: 'DF', status: 'ATIVO', limiteCredito: 12000, createdAt: daysAgo(45), updatedAt: daysAgo(15) },
    { id: generateId(), nome: 'Fernando Henrique Pereira', cpf: '789.012.345-66', email: 'fernando.pereira@corp.com', telefone: '(48) 3224-5678', celular: '(48) 98876-5432', dataNascimento: '1987-06-18', cep: '88015-300', logradouro: 'Av. Hercílio Luz', numero: '450', complemento: 'Sala 803', bairro: 'Centro', cidade: 'Florianópolis', estado: 'SC', status: 'ATIVO', limiteCredito: 18000, createdAt: daysAgo(40), updatedAt: daysAgo(7) },
    { id: generateId(), nome: 'Camila Aparecida Martins', cpf: '890.123.456-77', email: 'camila.martins@design.co', telefone: '(19) 3456-7890', celular: '(19) 99876-1234', dataNascimento: '1993-01-25', cep: '13010-120', logradouro: 'Rua Barão de Jaguara', numero: '1340', complemento: '', bairro: 'Centro', cidade: 'Campinas', estado: 'SP', status: 'INATIVO', limiteCredito: 5000, createdAt: daysAgo(100), updatedAt: daysAgo(30) },
  ]
  for (const c of clientes) db.cliente._insert(c)
  const cliMap = new Map(clientes.map((c) => [c.nome, c.id]))

  // ==================== Helper: generate sale number ====================
  const saleCounters = new Map<string, number>()
  function saleNum(dayOffset: number, seq: number): string {
    const d = new Date()
    d.setDate(d.getDate() - dayOffset)
    const ds = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    return `VND-${ds}-${String(seq).padStart(4, '0')}`
  }

  // ==================== Vendas + ItemVendas ====================
  const salesData: Array<{
    dayAgo: number; hour: number; clienteId: string | null; formaPagamento: string;
    items: Array<{ prodCode: string; qty: number }>; desconto?: number;
    status?: string; observacoes?: string;
  }> = [
    // Today (day 0) - 3 sales
    { dayAgo: 0, hour: 9, clienteId: cliMap.get('Carlos Eduardo Silva')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'NB-DELL-15', qty: 1 }, { prodCode: 'SSD-KING-1T', qty: 1 }] },
    { dayAgo: 0, hour: 11, clienteId: cliMap.get('Maria Fernanda Costa')!, formaPagamento: 'PIX', items: [{ prodCode: 'DT-GAMER-4060', qty: 1 }, { prodCode: 'TEC-MEC-RGB', qty: 1 }] },
    { dayAgo: 0, hour: 14, clienteId: null, formaPagamento: 'DINHEIRO', items: [{ prodCode: 'MOU-LOGI-MX3', qty: 1 }, { prodCode: 'CAM-FHD-1080', qty: 1 }] },
    // Day 1 (yesterday) - 2 sales
    { dayAgo: 1, hour: 10, clienteId: cliMap.get('João Pedro Santos')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'SSD-KING-1T', qty: 2 }, { prodCode: 'RAM-DDR5-16', qty: 1 }] },
    { dayAgo: 1, hour: 15, clienteId: cliMap.get('Ana Clara Oliveira')!, formaPagamento: 'PIX', items: [{ prodCode: 'HEAD-HYPERX', qty: 2 }, { prodCode: 'CAB-CAT6-5M', qty: 3 }] },
    // Day 2 - 2 sales
    { dayAgo: 2, hour: 9, clienteId: cliMap.get('Rafael Almeida Souza')!, formaPagamento: 'BOLETO', items: [{ prodCode: 'PV-RTX4070', qty: 1 }] },
    { dayAgo: 2, hour: 16, clienteId: null, formaPagamento: 'DINHEIRO', items: [{ prodCode: 'ROT-WIFI6', qty: 1 }, { prodCode: 'FONTE-600W', qty: 1 }, { prodCode: 'CAB-CAT6-5M', qty: 2 }] },
    // Day 3 - 1 sale
    { dayAgo: 3, hour: 11, clienteId: cliMap.get('Juliana Rodrigues Lima')!, formaPagamento: 'CARTÃO DÉBITO', items: [{ prodCode: 'MON-LG-274K', qty: 1 }, { prodCode: 'TEC-MEC-RGB', qty: 1 }] },
    // Day 4 - 2 sales
    { dayAgo: 4, hour: 10, clienteId: cliMap.get('Fernando Henrique Pereira')!, formaPagamento: 'PIX', items: [{ prodCode: 'NB-DELL-15', qty: 1 }] },
    { dayAgo: 4, hour: 14, clienteId: cliMap.get('Carlos Eduardo Silva')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'RAM-DDR5-16', qty: 2 }] },
    // Day 5 - 2 sales
    { dayAgo: 5, hour: 9, clienteId: null, formaPagamento: 'DINHEIRO', items: [{ prodCode: 'HUB-USBC-7P', qty: 2 }, { prodCode: 'MOU-LOGI-MX3', qty: 1 }] },
    { dayAgo: 5, hour: 13, clienteId: cliMap.get('Rafael Almeida Souza')!, formaPagamento: 'PIX', items: [{ prodCode: 'SWITCH-16P', qty: 1 }] },
    // Day 6 - 2 sales
    { dayAgo: 6, hour: 10, clienteId: cliMap.get('Maria Fernanda Costa')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'SSD-KING-1T', qty: 3 }] },
    { dayAgo: 6, hour: 15, clienteId: cliMap.get('João Pedro Santos')!, formaPagamento: 'BOLETO', items: [{ prodCode: 'DT-GAMER-4060', qty: 1 }, { prodCode: 'MON-LG-274K', qty: 1 }] },
    // Day 8 - 1 sale
    { dayAgo: 8, hour: 11, clienteId: cliMap.get('Ana Clara Oliveira')!, formaPagamento: 'CARTÃO DÉBITO', items: [{ prodCode: 'HEAD-HYPERX', qty: 1 }] },
    // Day 10 - 1 sale
    { dayAgo: 10, hour: 14, clienteId: cliMap.get('Juliana Rodrigues Lima')!, formaPagamento: 'PIX', items: [{ prodCode: 'PV-RTX4070', qty: 1 }, { prodCode: 'FONTE-600W', qty: 1 }] },
    // Day 12 - 1 sale
    { dayAgo: 12, hour: 10, clienteId: cliMap.get('Fernando Henrique Pereira')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'ROT-WIFI6', qty: 2 }, { prodCode: 'CAB-CAT6-5M', qty: 5 }] },
    // Day 15 - 1 sale
    { dayAgo: 15, hour: 9, clienteId: cliMap.get('Carlos Eduardo Silva')!, formaPagamento: 'PIX', items: [{ prodCode: 'NB-DELL-15', qty: 1 }, { prodCode: 'MOU-LOGI-MX3', qty: 1 }] },
    // Day 18 - 1 sale
    { dayAgo: 18, hour: 14, clienteId: cliMap.get('Maria Fernanda Costa')!, formaPagamento: 'CARTÃO CRÉDITO', items: [{ prodCode: 'MON-LG-274K', qty: 1 }, { prodCode: 'CAM-FHD-1080', qty: 1 }] },
    // Day 20 - 1 sale
    { dayAgo: 20, hour: 10, clienteId: null, formaPagamento: 'DINHEIRO', items: [{ prodCode: 'SSD-KING-1T', qty: 2 }] },
    // Day 23 - 1 sale
    { dayAgo: 23, hour: 11, clienteId: cliMap.get('João Pedro Santos')!, formaPagamento: 'BOLETO', items: [{ prodCode: 'TEC-MEC-RGB', qty: 3 }] },
    // Day 25 - 1 sale
    { dayAgo: 25, hour: 15, clienteId: cliMap.get('Rafael Almeida Souza')!, formaPagamento: 'CARTÃO DÉBITO', items: [{ prodCode: 'HUB-USBC-7P', qty: 1 }, { prodCode: 'CAB-CAT6-5M', qty: 2 }] },
    // Day 28 - 1 sale
    { dayAgo: 28, hour: 10, clienteId: cliMap.get('Ana Clara Oliveira')!, formaPagamento: 'PIX', items: [{ prodCode: 'SWITCH-16P', qty: 1 }] },
    // Day 30 - 1 sale (cancelled)
    { dayAgo: 30, hour: 9, clienteId: cliMap.get('Camila Aparecida Martins')!, formaPagamento: 'DINHEIRO', items: [{ prodCode: 'FONTE-600W', qty: 1 }, { prodCode: 'RAM-DDR5-16', qty: 1 }], status: 'CANCELADA', observacoes: 'Cancelado pelo cliente' },
  ]

  // Track sale numbers per day
  const daySeqCounters = new Map<number, number>()
  const vendaIds: string[] = []

  for (const sd of salesData) {
    const seq = (daySeqCounters.get(sd.dayAgo) || 0) + 1
    daySeqCounters.set(sd.dayAgo, seq)

    const saleDate = daysAgo(sd.dayAgo, sd.hour)
    let subtotal = 0
    const itemRecords: Array<Record<string, unknown>> = []

    for (const item of sd.items) {
      const prod = prodByCode.get(item.prodCode)!
      const itemSubtotal = prod.precoVenda * item.qty
      subtotal += itemSubtotal
      itemRecords.push({
        id: generateId(),
        vendaId: '', // will be set after venda creation
        produtoId: prod.id,
        quantidade: item.qty,
        precoUnitario: prod.precoVenda,
        subtotal: itemSubtotal,
        createdAt: saleDate,
      })
    }

    const desconto = sd.desconto || 0
    const total = subtotal - desconto
    const vendaId = generateId()
    vendaIds.push(vendaId)

    const venda = {
      id: vendaId,
      numero: saleNum(sd.dayAgo, seq),
      clienteId: sd.clienteId,
      dataVenda: saleDate,
      subtotal,
      desconto,
      total,
      formaPagamento: sd.formaPagamento,
      status: sd.status || 'CONCLUIDA',
      observacoes: sd.observacoes || null,
      createdAt: saleDate,
      updatedAt: saleDate,
    }
    db.venda._insert(venda)

    // Insert item vendas
    for (const item of itemRecords) {
      item.vendaId = vendaId
      db.itemVenda._insert(item)
    }
  }

  // ==================== Movimentações de Estoque ====================
  const movimentacoes = [
    // Some entradas (stock additions)
    { produtoId: prodMap.get('NB-DELL-15')!, tipo: 'ENTRADA', quantidade: 20, estoqueAntes: 0, estoqueDepois: 20, motivo: 'Compra inicial de estoque', createdAt: daysAgo(45, 8) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'ENTRADA', quantidade: 10, estoqueAntes: 0, estoqueDepois: 10, motivo: 'Compra inicial de estoque', createdAt: daysAgo(40, 8) },
    { produtoId: prodMap.get('SSD-KING-1T')!, tipo: 'ENTRADA', quantidade: 50, estoqueAntes: 0, estoqueDepois: 50, motivo: 'Compra em lote', createdAt: daysAgo(28, 9) },
    { produtoId: prodMap.get('RAM-DDR5-16')!, tipo: 'ENTRADA', quantidade: 10, estoqueAntes: 0, estoqueDepois: 10, motivo: 'Reposição de estoque', createdAt: daysAgo(28, 10) },
    { produtoId: prodMap.get('CAB-CAT6-5M')!, tipo: 'ENTRADA', quantidade: 100, estoqueAntes: 0, estoqueDepois: 100, motivo: 'Compra em lote', createdAt: daysAgo(12, 8) },
    // Saidas from sales (we'll just add a couple representative ones)
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 10, estoqueDepois: 9, motivo: 'Venda VND', createdAt: daysAgo(6, 15) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 9, estoqueDepois: 8, motivo: 'Venda VND', createdAt: daysAgo(0, 11) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 8, estoqueDepois: 7, motivo: 'Venda VND', createdAt: daysAgo(2, 16) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 7, estoqueDepois: 6, motivo: 'Venda VND', createdAt: daysAgo(13, 10) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 6, estoqueDepois: 5, motivo: 'Venda VND', createdAt: daysAgo(20, 11) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 5, estoqueDepois: 4, motivo: 'Venda VND', createdAt: daysAgo(23, 14) },
    { produtoId: prodMap.get('DT-GAMER-4060')!, tipo: 'SAIDA', quantidade: 1, estoqueAntes: 4, estoqueDepois: 3, motivo: 'Venda VND', createdAt: daysAgo(8, 9) },
    // Ajustes
    { produtoId: prodMap.get('CAM-FHD-1080')!, tipo: 'AJUSTE', quantidade: 2, estoqueAntes: 5, estoqueDepois: 2, motivo: 'Ajuste de inventário - divergência encontrada', createdAt: daysAgo(3, 8) },
  ]
  for (const m of movimentacoes) {
    db.movimentacaoEstoque._insert({
      id: generateId(),
      ...m,
    })
  }

  // ==================== Financeiro ====================
  const financeiro = [
    // Receber - from credit card and boleto sales (a few)
    { clienteId: cliMap.get('Carlos Eduardo Silva')!, tipo: 'RECEBER', descricao: 'Venda - Notebook Dell + SSD', valor: 4758, dataVencimento: dateStr(5), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'CARTÃO CRÉDITO', vendaId: vendaIds[0], createdAt: daysAgo(0, 9) },
    { clienteId: cliMap.get('João Pedro Santos')!, tipo: 'RECEBER', descricao: 'Venda - 2x SSD + RAM', valor: 1307, dataVencimento: dateStr(15), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'CARTÃO CRÉDITO', vendaId: vendaIds[3], createdAt: daysAgo(1, 10) },
    { clienteId: cliMap.get('Rafael Almeida Souza')!, tipo: 'RECEBER', descricao: 'Venda - RTX 4070', valor: 3899, dataVencimento: dateStr(20), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'BOLETO', vendaId: vendaIds[5], createdAt: daysAgo(2, 9) },
    { clienteId: cliMap.get('Juliana Rodrigues Lima')!, tipo: 'RECEBER', descricao: 'Venda - Monitor + Teclado', valor: 2548, dataVencimento: dateStr(25), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'CARTÃO CRÉDITO', vendaId: vendaIds[8], createdAt: daysAgo(3, 11) },
    { clienteId: cliMap.get('Maria Fernanda Costa')!, tipo: 'RECEBER', descricao: 'Venda - Desktop Gamer + Teclado', valor: 8248, dataVencimento: dateStr(-5), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'CARTÃO CRÉDITO', vendaId: vendaIds[1], createdAt: daysAgo(0, 11) },
    // Overdue receivable
    { clienteId: cliMap.get('Fernando Henrique Pereira')!, tipo: 'RECEBER', descricao: 'Venda - RTX 4070 + Fonte', valor: 4228, dataVencimento: dateStr(-10), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'BOLETO', vendaId: vendaIds[14], createdAt: daysAgo(10, 14) },
    // Paid receivables
    { clienteId: cliMap.get('Carlos Eduardo Silva')!, tipo: 'RECEBER', descricao: 'Venda - 2x Memória RAM', valor: 778, dataVencimento: dateStr(-10), dataPagamento: dateStr(-8), status: 'PAGO', formaPagamento: 'CARTÃO CRÉDITO', vendaId: vendaIds[9], createdAt: daysAgo(4, 14) },
    { clienteId: cliMap.get('João Pedro Santos')!, tipo: 'RECEBER', descricao: 'Venda - Desktop + Monitor', valor: 10098, dataVencimento: dateStr(-7), dataPagamento: dateStr(-5), status: 'PAGO', formaPagamento: 'BOLETO', vendaId: vendaIds[12], createdAt: daysAgo(6, 15) },
    // Pagar (expenses)
    { clienteId: null, tipo: 'PAGAR', descricao: 'Compra de estoque - SSDs Kingston', valor: 15500, dataVencimento: dateStr(-3), dataPagamento: dateStr(-2), status: 'PAGO', formaPagamento: 'BOLETO', vendaId: null, createdAt: daysAgo(15, 8) },
    { clienteId: null, tipo: 'PAGAR', descricao: 'Aluguel do escritório - Janeiro', valor: 4500, dataVencimento: dateStr(5), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'BOLETO', vendaId: null, createdAt: daysAgo(20, 8) },
    { clienteId: null, tipo: 'PAGAR', descricao: 'Conta de energia elétrica', valor: 1200, dataVencimento: dateStr(-8), dataPagamento: null, status: 'PENDENTE', formaPagamento: 'BOLETO', vendaId: null, createdAt: daysAgo(25, 8) },
  ]
  for (const f of financeiro) {
    db.financeiro._insert({
      id: generateId(),
      ...f,
      createdAt: f.createdAt as Date,
      updatedAt: f.createdAt as Date,
    })
  }
}

// -------------------- Factory & Export --------------------

export function createMemoryDb(): MemoryDatabase {
  const db = new MemoryDatabase()
  seedData(db)
  return db
}

export const memoryDb = createMemoryDb()