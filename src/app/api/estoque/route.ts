import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const produtoId = searchParams.get('produtoId')
    const tipo = searchParams.get('tipo')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    if (produtoId) {
      where.produtoId = produtoId
    }

    if (tipo) {
      where.tipo = tipo
    }

    if (dataInicio || dataFim) {
      where.createdAt = {}
      if (dataInicio) {
        ;(where.createdAt as Record<string, unknown>).gte = new Date(dataInicio)
      }
      if (dataFim) {
        ;(where.createdAt as Record<string, unknown>).lte = new Date(dataFim + 'T23:59:59')
      }
    }

    const [movimentacoes, total] = await Promise.all([
      db.movimentacaoEstoque.findMany({
        where,
        include: {
          produto: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.movimentacaoEstoque.count({ where }),
    ])

    return NextResponse.json({
      data: movimentacoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar movimentações de estoque:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.produtoId || !body.tipo || body.quantidade === undefined) {
      return NextResponse.json(
        { error: 'Produto, tipo e quantidade são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['ENTRADA', 'SAIDA', 'AJUSTE'].includes(body.tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser ENTRADA, SAIDA ou AJUSTE' },
        { status: 400 }
      )
    }

    const produto = await db.produto.findUnique({ where: { id: body.produtoId } })
    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const estoqueAntes = produto.estoqueAtual
    let estoqueDepois: number

    if (body.tipo === 'ENTRADA') {
      estoqueDepois = estoqueAntes + body.quantidade
    } else if (body.tipo === 'SAIDA') {
      if (estoqueAntes < body.quantidade) {
        return NextResponse.json(
          { error: `Estoque insuficiente. Disponível: ${estoqueAntes}` },
          { status: 400 }
        )
      }
      estoqueDepois = estoqueAntes - body.quantidade
    } else {
      // AJUSTE - set to exact quantity
      estoqueDepois = body.quantidade
    }

    const movimentacao = await db.$transaction(async (tx) => {
      const movement = await tx.movimentacaoEstoque.create({
        data: {
          produtoId: body.produtoId,
          tipo: body.tipo,
          quantidade: body.tipo === 'AJUSTE' ? Math.abs(estoqueDepois - estoqueAntes) : body.quantidade,
          estoqueAntes,
          estoqueDepois,
          motivo: body.motivo || null,
        },
        include: { produto: true },
      })

      await tx.produto.update({
        where: { id: body.produtoId },
        data: { estoqueAtual: estoqueDepois },
      })

      return movement
    })

    return NextResponse.json(movimentacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar movimentação de estoque:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}