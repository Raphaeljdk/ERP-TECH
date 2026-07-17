import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const dataInicio = searchParams.get('startDate')
    const dataFim = searchParams.get('endDate')
    const limite = parseInt(searchParams.get('limite') || '10')

    if (!tipo) {
      return NextResponse.json({ error: 'Parâmetro "tipo" é obrigatório' }, { status: 400 })
    }

    switch (tipo) {
      case 'vendas-por-periodo': {
        if (!dataInicio || !dataFim) {
          return NextResponse.json(
            { error: 'startDate e endDate são obrigatórios para este relatório' },
            { status: 400 }
          )
        }

        const vendas = await db.venda.findMany({
          where: {
            dataVenda: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim + 'T23:59:59'),
            },
            status: { not: 'CANCELADA' },
          },
          select: {
            dataVenda: true,
            total: true,
          },
          orderBy: { dataVenda: 'asc' },
        })

        // Group by day
        const grouped: Record<string, { data: string; total: number; quantidade: number }> = {}
        for (const venda of vendas) {
          const dateStr = venda.dataVenda.toISOString().slice(0, 10)
          if (!grouped[dateStr]) {
            grouped[dateStr] = { data: dateStr, total: 0, quantidade: 0 }
          }
          grouped[dateStr].total += venda.total
          grouped[dateStr].quantidade += 1
        }

        return NextResponse.json({
          tipo: 'vendas-por-periodo',
          periodo: { inicio: dataInicio, fim: dataFim },
          data: Object.values(grouped),
        })
      }

      case 'produtos-mais-vendidos': {
        const topProdutos = await db.itemVenda.groupBy({
          by: ['produtoId'],
          _sum: { quantidade: true, subtotal: true },
          orderBy: { _sum: { quantidade: 'desc' } },
          take: limite,
        })

        const data = await Promise.all(
          topProdutos.map(async (item) => {
            const produto = await db.produto.findUnique({
              where: { id: item.produtoId },
              select: { nome: true, codigo: true },
            })
            return {
              produtoId: item.produtoId,
              nome: produto?.nome || 'Desconhecido',
              codigo: produto?.codigo || '',
              quantidadeVendida: item._sum.quantidade || 0,
              totalFaturado: item._sum.subtotal || 0,
            }
          })
        )

        return NextResponse.json({
          tipo: 'produtos-mais-vendidos',
          data,
        })
      }

      case 'clientes-fieis': {
        const topClientes = await db.venda.groupBy({
          by: ['clienteId'],
          _sum: { total: true },
          _count: { id: true },
          where: {
            clienteId: { not: null },
            status: { not: 'CANCELADA' },
          },
          orderBy: { _sum: { total: 'desc' } },
          take: limite,
        })

        const data = await Promise.all(
          topClientes.map(async (item) => {
            const cliente = await db.cliente.findUnique({
              where: { id: item.clienteId! },
              select: { nome: true, cpf: true },
            })
            return {
              clienteId: item.clienteId,
              nome: cliente?.nome || 'Desconhecido',
              cpf: cliente?.cpf || '',
              totalCompras: item._sum.total || 0,
              numeroVendas: item._count.id,
            }
          })
        )

        return NextResponse.json({
          tipo: 'clientes-fieis',
          data,
        })
      }

      case 'lucratividade': {
        const produtos = await db.produto.findMany({
          where: { status: 'ATIVO' },
          select: {
            id: true,
            nome: true,
            codigo: true,
            precoCusto: true,
            precoVenda: true,
            estoqueAtual: true,
            categoria: { select: { nome: true } },
          },
          orderBy: { nome: 'asc' },
        })

        // Get quantity sold for each product
        const vendasProdutos = await db.itemVenda.groupBy({
          by: ['produtoId'],
          _sum: { quantidade: true },
        })

        const vendasMap = new Map(
          vendasProdutos.map((v) => [v.produtoId, v._sum.quantidade || 0])
        )

        const data = produtos.map((p) => {
          const margem = p.precoVenda - p.precoCusto
          const margemPercentual = p.precoVenda > 0 ? (margem / p.precoVenda) * 100 : 0
          const quantidadeVendida = vendasMap.get(p.id) || 0
          const lucroTotal = margem * quantidadeVendida

          return {
            produtoId: p.id,
            nome: p.nome,
            codigo: p.codigo,
            categoria: p.categoria?.nome || 'Sem categoria',
            precoCusto: p.precoCusto,
            precoVenda: p.precoVenda,
            margem: Math.round(margem * 100) / 100,
            margemPercentual: Math.round(margemPercentual * 100) / 100,
            quantidadeVendida,
            lucroTotal: Math.round(lucroTotal * 100) / 100,
            estoqueAtual: p.estoqueAtual,
          }
        })

        // Sort by total profit descending
        data.sort((a, b) => b.lucroTotal - a.lucroTotal)

        return NextResponse.json({
          tipo: 'lucratividade',
          data,
        })
      }

      default:
        return NextResponse.json(
          { error: `Tipo de relatório inválido: ${tipo}. Use: vendas-por-periodo, produtos-mais-vendidos, clientes-fieis, lucratividade` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}