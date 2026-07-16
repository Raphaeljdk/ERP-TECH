import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const venda = await db.venda.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: { produto: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!venda) {
      return NextResponse.json({ error: 'Venda não encontrada' }, { status: 404 })
    }

    return NextResponse.json(venda)
  } catch (error) {
    console.error('Erro ao buscar venda:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingSale = await db.venda.findUnique({ where: { id } })
    if (!existingSale) {
      return NextResponse.json({ error: 'Venda não encontrada' }, { status: 404 })
    }

    const venda = await db.venda.update({
      where: { id },
      data: {
        status: body.status,
        observacoes: body.observacoes !== undefined ? body.observacoes : undefined,
      },
      include: {
        cliente: true,
        itens: { include: { produto: true } },
      },
    })

    // If status changed to CANCELADA, restore stock
    if (body.status === 'CANCELADA' && existingSale.status !== 'CANCELADA') {
      const itens = await db.itemVenda.findMany({ where: { vendaId: id } })
      for (const item of itens) {
        const produto = await db.produto.findUnique({ where: { id: item.produtoId } })
        if (produto) {
          const estoqueAntes = produto.estoqueAtual
          const estoqueDepois = estoqueAntes + item.quantidade

          await db.$transaction([
            db.produto.update({
              where: { id: item.produtoId },
              data: { estoqueAtual: estoqueDepois },
            }),
            db.movimentacaoEstoque.create({
              data: {
                produtoId: item.produtoId,
                tipo: 'ENTRADA',
                quantidade: item.quantidade,
                estoqueAntes,
                estoqueDepois,
                motivo: `Cancelamento venda ${existingSale.numero}`,
              },
            }),
          ])
        }
      }
    }

    return NextResponse.json(venda)
  } catch (error) {
    console.error('Erro ao atualizar venda:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}