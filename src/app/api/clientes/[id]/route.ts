import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cliente = await db.cliente.findUnique({
      where: { id },
      include: {
        vendas: {
          orderBy: { dataVenda: 'desc' },
          take: 10,
        },
        financeiro: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
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

    const existingClient = await db.cliente.findUnique({ where: { id } })
    if (!existingClient) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    if (body.cpf && body.cpf !== existingClient.cpf) {
      const cpfConflict = await db.cliente.findUnique({ where: { cpf: body.cpf } })
      if (cpfConflict) {
        return NextResponse.json({ error: 'Já existe um cliente com este CPF' }, { status: 409 })
      }
    }

    const cliente = await db.cliente.update({
      where: { id },
      data: {
        nome: body.nome,
        cpf: body.cpf,
        email: body.email !== undefined ? body.email : undefined,
        telefone: body.telefone !== undefined ? body.telefone : undefined,
        celular: body.celular !== undefined ? body.celular : undefined,
        dataNascimento: body.dataNascimento !== undefined ? body.dataNascimento : undefined,
        cep: body.cep !== undefined ? body.cep : undefined,
        logradouro: body.logradouro !== undefined ? body.logradouro : undefined,
        numero: body.numero !== undefined ? body.numero : undefined,
        complemento: body.complemento !== undefined ? body.complemento : undefined,
        bairro: body.bairro !== undefined ? body.bairro : undefined,
        cidade: body.cidade !== undefined ? body.cidade : undefined,
        estado: body.estado !== undefined ? body.estado : undefined,
        limiteCredito: body.limiteCredito !== undefined ? body.limiteCredito : undefined,
        status: body.status !== undefined ? body.status : undefined,
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingClient = await db.cliente.findUnique({ where: { id } })
    if (!existingClient) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const cliente = await db.cliente.update({
      where: { id },
      data: { status: 'INATIVO' },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Erro ao desativar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}