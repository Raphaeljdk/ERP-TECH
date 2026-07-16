import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingEntry = await db.financeiro.findUnique({ where: { id } })
    if (!existingEntry) {
      return NextResponse.json({ error: 'Entrada financeira não encontrada' }, { status: 404 })
    }

    const financeiro = await db.financeiro.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        dataPagamento: body.status === 'PAGO' ? new Date().toISOString().slice(0, 10) : undefined,
        descricao: body.descricao !== undefined ? body.descricao : undefined,
        valor: body.valor !== undefined ? body.valor : undefined,
        dataVencimento: body.dataVencimento !== undefined ? body.dataVencimento : undefined,
        formaPagamento: body.formaPagamento !== undefined ? body.formaPagamento : undefined,
      },
      include: { cliente: true },
    })

    return NextResponse.json(financeiro)
  } catch (error) {
    console.error('Erro ao atualizar entrada financeira:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingEntry = await db.financeiro.findUnique({ where: { id } })
    if (!existingEntry) {
      return NextResponse.json({ error: 'Entrada financeira não encontrada' }, { status: 404 })
    }

    await db.financeiro.delete({ where: { id } })

    return NextResponse.json({ message: 'Entrada financeira excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir entrada financeira:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}