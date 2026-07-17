import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const produto = await db.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        movimentacoes: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
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

    const existingProduct = await db.produto.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    if (body.codigo && body.codigo !== existingProduct.codigo) {
      const codeConflict = await db.produto.findUnique({ where: { codigo: body.codigo } })
      if (codeConflict) {
        return NextResponse.json({ error: 'Já existe um produto com este código' }, { status: 409 })
      }
    }

    const produto = await db.produto.update({
      where: { id },
      data: {
        codigo: body.codigo,
        nome: body.nome,
        descricao: body.descricao !== undefined ? body.descricao : undefined,
        precoCusto: body.precoCusto !== undefined ? body.precoCusto : undefined,
        precoVenda: body.precoVenda !== undefined ? body.precoVenda : undefined,
        estoqueMinimo: body.estoqueMinimo !== undefined ? body.estoqueMinimo : undefined,
        categoriaId: body.categoriaId !== undefined ? body.categoriaId : undefined,
        codigoBarras: body.codigoBarras !== undefined ? body.codigoBarras : undefined,
        unidade: body.unidade !== undefined ? body.unidade : undefined,
        status: body.status !== undefined ? body.status : undefined,
      },
      include: { categoria: true },
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingProduct = await db.produto.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const produto = await db.produto.update({
      where: { id },
      data: { status: 'INATIVO' },
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao desativar produto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}