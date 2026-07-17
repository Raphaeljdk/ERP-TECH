import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function generateSaleNumber(): Promise<string> {
  const today = new Date()
  const dateStr = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')

  const prefix = `VND-${dateStr}-`

  const lastSale = await db.venda.findFirst({
    where: { numero: { startsWith: prefix } },
    orderBy: { numero: 'desc' },
  })

  let sequence = 1
  if (lastSale) {
    const parts = lastSale.numero.split('-')
    sequence = parseInt(parts[parts.length - 1]) + 1
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const clienteId = searchParams.get('clienteId')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    const where: Record<string, unknown> = {}

    if (clienteId) {
      where.clienteId = clienteId
    }

    if (status) {
      where.status = status
    }

    if (dataInicio || dataFim) {
      where.dataVenda = {}
      if (dataInicio) {
        ;(where.dataVenda as Record<string, unknown>).gte = new Date(dataInicio)
      }
      if (dataFim) {
        ;(where.dataVenda as Record<string, unknown>).lte = new Date(dataFim + 'T23:59:59')
      }
    }

    const [vendas, total] = await Promise.all([
      db.venda.findMany({
        where,
        include: {
          cliente: true,
          itens: {
            include: { produto: true },
          },
        },
        orderBy: { dataVenda: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.venda.count({ where }),
    ])

    return NextResponse.json({
      data: vendas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar vendas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.itens || !Array.isArray(body.itens) || body.itens.length === 0) {
      return NextResponse.json({ error: 'A venda deve ter pelo menos um item' }, { status: 400 })
    }

    if (!body.formaPagamento) {
      return NextResponse.json({ error: 'Forma de pagamento é obrigatória' }, { status: 400 })
    }

    // Validate all products exist and have enough stock
    const productIds = body.itens.map((item: { produtoId: string }) => item.produtoId)
    const products = await db.produto.findMany({
      where: { id: { in: productIds } },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of body.itens) {
      const product = productMap.get(item.produtoId)
      if (!product) {
        return NextResponse.json(
          { error: `Produto ${item.produtoId} não encontrado` },
          { status: 400 }
        )
      }
      if (product.estoqueAtual < item.quantidade) {
        return NextResponse.json(
          { error: `Estoque insuficiente para o produto "${product.nome}". Disponível: ${product.estoqueAtual}` },
          { status: 400 }
        )
      }
    }

    const numero = await generateSaleNumber()

    let subtotal = 0
    const itensData = body.itens.map((item: { produtoId: string; quantidade: number; precoUnitario?: number }) => {
      const product = productMap.get(item.produtoId)!
      const precoUnitario = item.precoUnitario ?? product.precoVenda
      const itemSubtotal = precoUnitario * item.quantidade
      subtotal += itemSubtotal
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal: itemSubtotal,
      }
    })

    const desconto = body.desconto || 0
    const total = subtotal - desconto

    // Use a transaction to ensure data consistency
    const venda = await db.$transaction(async (tx) => {
      // Create the sale
      const sale = await tx.venda.create({
        data: {
          numero,
          clienteId: body.clienteId || null,
          subtotal,
          desconto,
          total,
          formaPagamento: body.formaPagamento,
          status: body.status || 'CONCLUIDA',
          observacoes: body.observacoes || null,
          itens: {
            create: itensData,
          },
        },
        include: {
          cliente: true,
          itens: { include: { produto: true } },
        },
      })

      // Update stock for each product and create movements
      for (const item of itensData) {
        const product = productMap.get(item.produtoId)!
        const estoqueAntes = product.estoqueAtual
        const estoqueDepois = estoqueAntes - item.quantidade

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoqueAtual: estoqueDepois },
        })

        await tx.movimentacaoEstoque.create({
          data: {
            produtoId: item.produtoId,
            tipo: 'SAIDA',
            quantidade: item.quantidade,
            estoqueAntes,
            estoqueDepois,
            motivo: `Venda ${numero}`,
          },
        })
      }

      // Create financial entry if the sale is not paid upfront
      if (body.formaPagamento !== 'DINHEIRO' && body.formaPagamento !== 'PIX') {
        const vencimento = body.dataVencimento || new Date().toISOString().slice(0, 10)
        await tx.financeiro.create({
          data: {
            clienteId: body.clienteId || null,
            tipo: 'RECEBER',
            descricao: `Venda ${numero}`,
            valor: total,
            dataVencimento: vencimento,
            status: 'PENDENTE',
            formaPagamento: body.formaPagamento,
            vendaId: sale.id,
          },
        })
      }

      return sale
    })

    return NextResponse.json(venda, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar venda:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}