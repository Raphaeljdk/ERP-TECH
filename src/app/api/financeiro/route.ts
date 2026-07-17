import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}

    if (tipo) {
      where.tipo = tipo
    }

    if (status) {
      where.status = status
    } else {
      // Auto-check for overdue entries
      const today = new Date().toISOString().slice(0, 10)
      // We'll return PENDENTE and ATRASADO entries; the ATRASADO status is set dynamically
    }

    if (dataInicio || dataFim) {
      where.dataVencimento = {}
      if (dataInicio) {
        ;(where.dataVencimento as Record<string, unknown>).gte = dataInicio
      }
      if (dataFim) {
        ;(where.dataVencimento as Record<string, unknown>).lte = dataFim
      }
    }

    const [financeiro, total] = await Promise.all([
      db.financeiro.findMany({
        where,
        include: {
          cliente: true,
        },
        orderBy: { dataVencimento: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.financeiro.count({ where }),
    ])

    // Mark overdue entries
    const today = new Date().toISOString().slice(0, 10)
    const enrichedData = financeiro.map((entry) => {
      if (entry.status === 'PENDENTE' && entry.dataVencimento < today) {
        return { ...entry, status: 'ATRASADO' }
      }
      return entry
    })

    return NextResponse.json({
      data: enrichedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar financeiro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.descricao || body.valor === undefined || !body.dataVencimento || !body.tipo) {
      return NextResponse.json(
        { error: 'Descrição, valor, data de vencimento e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['RECEBER', 'PAGAR'].includes(body.tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser RECEBER ou PAGAR' },
        { status: 400 }
      )
    }

    // Check if past due
    const today = new Date().toISOString().slice(0, 10)
    const isOverdue = body.dataVencimento < today

    const financeiro = await db.financeiro.create({
      data: {
        clienteId: body.clienteId || null,
        tipo: body.tipo,
        descricao: body.descricao,
        valor: body.valor,
        dataVencimento: body.dataVencimento,
        status: body.status || (isOverdue ? 'ATRASADO' : 'PENDENTE'),
        formaPagamento: body.formaPagamento || null,
        vendaId: body.vendaId || null,
      },
      include: { cliente: true },
    })

    return NextResponse.json(financeiro, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar entrada financeira:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}