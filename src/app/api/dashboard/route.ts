import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const vendasHoje = await db.venda.aggregate({
      _sum: { total: true },
      where: {
        dataVenda: { gte: todayStart },
        status: { not: 'CANCELADA' },
      },
    })

    const vendasMes = await db.venda.aggregate({
      _sum: { total: true },
      where: {
        dataVenda: { gte: monthStart },
        status: { not: 'CANCELADA' },
      },
    })

    const totalClientes = await db.cliente.count({
      where: { status: 'ATIVO' },
    })

    const produtosEstoqueBaixoRaw = await db.$queryRawUnsafe(`
      SELECT id, nome, "estoqueAtual" as estoque, "estoqueMinimo" as estoqueMinimo
      FROM "Produto" 
      WHERE "status" = 'ATIVO' AND "estoqueAtual" <= "estoqueMinimo" 
      ORDER BY "estoqueAtual" ASC LIMIT 10
    `) as { id: string; nome: string; estoque: number; estoqueMinimo: number }[]

    const produtosBaixaEstoque = produtosEstoqueBaixoRaw.length

    // Sales last 7 days for chart
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const vendas7DiasRaw = await db.venda.findMany({
      where: {
        dataVenda: { gte: sevenDaysAgo },
        status: { not: 'CANCELADA' },
      },
      select: { dataVenda: true, total: true },
      orderBy: { dataVenda: 'asc' },
    })

    const vendas7Dias: { dia: string; valor: number }[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().slice(0, 10)
      const daySales = vendas7DiasRaw.filter((v) => v.dataVenda.toISOString().slice(0, 10) === dateStr)
      const dayTotal = daySales.reduce((sum, v) => sum + v.total, 0)
      const dayLabel = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      vendas7Dias.push({ dia: dayLabel, vendas: dayTotal })
    }

    // Top 5 products
    const topProdutosRaw = await db.itemVenda.groupBy({
      by: ['produtoId'],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: 'desc' } },
      take: 5,
    })

    const topProdutos = await Promise.all(
      topProdutosRaw.map(async (item) => {
        const produto = await db.produto.findUnique({
          where: { id: item.produtoId },
          select: { nome: true },
        })
        return {
          nome: produto?.nome || 'Desconhecido',
          quantidade: item._sum.quantidade || 0,
        }
      })
    )

    // Sales by payment method
    const formaPagamentoRaw = await db.venda.groupBy({
      by: ['formaPagamento'],
      _sum: { total: true },
      where: {
        status: { not: 'CANCELADA' },
        dataVenda: { gte: monthStart },
      },
    })

    const vendasPorPagamento = formaPagamentoRaw.map((item) => ({
      forma: item.formaPagamento,
      valor: item._sum.total || 0,
    }))

    const numeroVendasHoje = await db.venda.count({
      where: {
        dataVenda: { gte: todayStart },
        status: { not: 'CANCELADA' },
      },
    })

    // Últimas 5 vendas
    const ultimasVendasRaw = await db.venda.findMany({
      where: { status: { not: 'CANCELADA' } },
      select: {
        id: true,
        numero: true,
        dataVenda: true,
        total: true,
        formaPagamento: true,
        status: true,
        cliente: { select: { nome: true } },
      },
      orderBy: { dataVenda: 'desc' },
      take: 5,
    })

    const ultimasVendas = ultimasVendasRaw.map((v) => ({
      id: v.id,
      numero: v.numero,
      dataVenda: v.dataVenda.toISOString(),
      clienteNome: v.cliente?.nome || 'Consumidor Final',
      total: v.total,
      formaPagamento: v.formaPagamento,
      status: v.status,
    }))

    return NextResponse.json({
      vendasHoje: vendasHoje._sum.total || 0,
      vendasMes: vendasMes._sum.total || 0,
      totalClientes,
      produtosBaixaEstoque,
      vendas7Dias,
      topProdutos,
      vendasPorPagamento,
      produtosEstoqueBaixo: produtosEstoqueBaixoRaw,
      numeroVendasHoje,
      ultimasVendas,
    })
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}