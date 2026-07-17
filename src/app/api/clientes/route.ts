import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  return true
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('busca') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (busca) {
      where.OR = [
        { nome: { contains: busca } },
        { cpf: { contains: busca } },
        { email: { contains: busca } },
        { telefone: { contains: busca } },
        { celular: { contains: busca } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [clientes, total] = await Promise.all([
      db.cliente.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.cliente.count({ where }),
    ])

    return NextResponse.json({
      data: clientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.nome || !body.cpf) {
      return NextResponse.json({ error: 'Nome e CPF são obrigatórios' }, { status: 400 })
    }

    if (!validateCPF(body.cpf)) {
      return NextResponse.json(
        { error: 'CPF inválido. Use o formato 000.000.000-00' },
        { status: 400 }
      )
    }

    const existingClient = await db.cliente.findUnique({
      where: { cpf: body.cpf },
    })

    if (existingClient) {
      return NextResponse.json({ error: 'Já existe um cliente com este CPF' }, { status: 409 })
    }

    const cliente = await db.cliente.create({
      data: {
        nome: body.nome,
        cpf: body.cpf,
        email: body.email || null,
        telefone: body.telefone || null,
        celular: body.celular || null,
        dataNascimento: body.dataNascimento || null,
        cep: body.cep || null,
        logradouro: body.logradouro || null,
        numero: body.numero || null,
        complemento: body.complemento || null,
        bairro: body.bairro || null,
        cidade: body.cidade || null,
        estado: body.estado || null,
        limiteCredito: body.limiteCredito || 0,
        status: body.status || 'ATIVO',
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}