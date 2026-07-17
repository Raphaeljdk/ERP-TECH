import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clientes = await db.cliente.findMany({
      where: { status: 'ATIVO' },
      orderBy: { nome: 'asc' },
    })

    const header = 'Nome,CPF,E-mail,Telefone,Celular,Cidade,Estado,Limite de Crédito,Status\n'
    const rows = clientes
      .map((c) =>
        [
          c.nome,
          c.cpf,
          c.email || '',
          c.telefone || '',
          c.celular || '',
          c.cidade || '',
          c.estado || '',
          c.limiteCredito,
          c.status,
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n')

    const csv = header + rows

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="clientes_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    console.error('Erro ao exportar clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}