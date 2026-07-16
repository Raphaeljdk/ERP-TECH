import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categorias = await db.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: { produtos: true },
        },
      },
    })

    return NextResponse.json({ data: categorias })
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome) {
      return NextResponse.json({ error: 'Nome da categoria é obrigatório' }, { status: 400 })
    }

    const existingCategory = await db.categoria.findUnique({
      where: { nome: body.nome },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 409 }
      )
    }

    const categoria = await db.categoria.create({
      data: {
        nome: body.nome,
        descricao: body.descricao || null,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}