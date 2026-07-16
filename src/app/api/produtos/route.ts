import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca') || ''
    const categoriaId = searchParams.get('categoriaId')
    const estoqueBaixo = searchParams.get('estoqueBaixo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (busca) {
      where.OR = [
        { nome: { contains: busca } },
        { codigo: { contains: busca } },
        { codigoBarras: { contains: busca } },
        { descricao: { contains: busca } },
      ]
    }

    if (categoriaId) {
      where.categoriaId = categoriaId
    }

    if (status) {
      where.status = status
    }

    // Low stock filter: use raw SQL for column comparison
    if (estoqueBaixo === 'true') {
      const offset = (page - 1) * limit

      const buildConditions = () => {
        const conditions: string[] = []
        const params: unknown[] = []
        let paramIndex = 1

        if (status) {
          conditions.push(`p."status" = $${paramIndex}`)
          params.push(status)
          paramIndex++
        } else {
          conditions.push(`p."status" = 'ATIVO'`)
        }

        if (categoriaId) {
          conditions.push(`p."categoriaId" = $${paramIndex}`)
          params.push(categoriaId)
          paramIndex++
        }

        if (busca) {
          conditions.push(`(p."nome" LIKE $${paramIndex} OR p."codigo" LIKE $${paramIndex} OR p."codigoBarras" LIKE $${paramIndex} OR p."descricao" LIKE $${paramIndex})`)
          params.push(`%${busca}%`)
          paramIndex++
        }

        // Always add low stock condition
        conditions.push('p."estoqueAtual" <= p."estoqueMinimo"')

        return { conditions: conditions.join(' AND '), params, paramIndex }
      }

      const { conditions, params, paramIndex } = buildConditions()

      const [produtos, countResult] = await Promise.all([
        db.$queryRawUnsafe(
          `SELECT p.*, c."id" as "cat_id", c."nome" as "cat_nome", c."descricao" as "cat_descricao" FROM "Produto" p LEFT JOIN "Categoria" c ON p."categoriaId" = c."id" WHERE ${conditions} ORDER BY p."nome" ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
          ...params, limit, offset
        ),
        db.$queryRawUnsafe(`
          SELECT COUNT(*) as count FROM "Produto" p WHERE ${conditions}
        `, ...params),
      ])

      const formattedProducts = (produtos as Record<string, unknown>[]).map((p) => ({
        id: p.id,
        codigo: p.codigo,
        nome: p.nome,
        descricao: p.descricao,
        precoCusto: Number(p.precoCusto),
        precoVenda: Number(p.precoVenda),
        estoqueAtual: p.estoqueAtual as number,
        estoqueMinimo: p.estoqueMinimo as number,
        categoriaId: p.categoriaId,
        codigoBarras: p.codigoBarras,
        unidade: p.unidade,
        status: p.status,
        createdAt: new Date(p.createdAt as string),
        updatedAt: new Date(p.updatedAt as string),
        categoria: p.cat_id
          ? { id: p.cat_id, nome: p.cat_nome, descricao: p.cat_descricao }
          : null,
      }))

      const total = (countResult as { count: number }[])[0]?.count || 0

      return NextResponse.json({
        data: formattedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    }

    const [produtos, total] = await Promise.all([
      db.produto.findMany({
        where,
        include: { categoria: true },
        orderBy: { nome: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.produto.count({ where }),
    ])

    return NextResponse.json({
      data: produtos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome || !body.codigo || body.precoVenda === undefined) {
      return NextResponse.json(
        { error: 'Nome, código e preço de venda são obrigatórios' },
        { status: 400 }
      )
    }

    const existingProduct = await db.produto.findUnique({
      where: { codigo: body.codigo },
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Já existe um produto com este código' }, { status: 409 })
    }

    const produto = await db.produto.create({
      data: {
        codigo: body.codigo,
        nome: body.nome,
        descricao: body.descricao || null,
        precoCusto: body.precoCusto || 0,
        precoVenda: body.precoVenda,
        estoqueAtual: body.estoqueAtual || 0,
        estoqueMinimo: body.estoqueMinimo || 5,
        categoriaId: body.categoriaId || null,
        codigoBarras: body.codigoBarras || null,
        unidade: body.unidade || 'UN',
        status: body.status || 'ATIVO',
      },
      include: { categoria: true },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}