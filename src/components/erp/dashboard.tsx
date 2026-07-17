'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Package, AlertTriangle, DollarSign, ShoppingCart, UserPlus, PlusCircle, CalendarDays, ArrowRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { useErpStore } from '@/store/use-erp-store'

const lineChartConfig = {
  vendas: { label: 'Vendas', color: 'oklch(0.55 0.15 155)' },
} satisfies ChartConfig

const barChartConfig = {
  quantidade: { label: 'Quantidade', color: 'oklch(0.55 0.15 155)' },
} satisfies ChartConfig

const pieChartConfig = {
  dinheiro: { label: 'Dinheiro', color: 'oklch(0.55 0.15 155)' },
  credito: { label: 'Cartão Crédito', color: 'oklch(0.65 0.15 145)' },
  debito: { label: 'Cartão Débito', color: 'oklch(0.75 0.12 160)' },
  pix: { label: 'PIX', color: 'oklch(0.45 0.18 150)' },
  boleto: { label: 'Boleto', color: 'oklch(0.85 0.08 155)' },
} satisfies ChartConfig

const PIE_COLORS = [
  'oklch(0.55 0.15 155)',
  'oklch(0.65 0.15 145)',
  'oklch(0.75 0.12 160)',
  'oklch(0.45 0.18 150)',
  'oklch(0.85 0.08 155)',
]

interface UltimaVenda {
  id: string
  numero: string
  dataVenda: string
  clienteNome: string
  total: number
  formaPagamento: string
  status: string
}

interface DashboardData {
  vendasHoje: number
  vendasMes: number
  totalClientes: number
  produtosBaixaEstoque: number
  vendas7Dias: { dia: string; vendas: number }[]
  topProdutos: { nome: string; quantidade: number }[]
  vendasPorPagamento: { forma: string; valor: number }[]
  produtosEstoqueBaixo: { id: string; nome: string; estoque: number; estoqueMinimo: number }[]
  numeroVendasHoje?: number
  ultimasVendas?: UltimaVenda[]
}

function fetchDashboard(): Promise<DashboardData> {
  return fetch('/api/dashboard').then((r) => r.json())
}

function useClientDate() {
  const [todayDate, setTodayDate] = useState('')
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const now = new Date()
    setTodayDate(
      now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
    const hour = now.getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  return { todayDate, greeting }
}

function TrendArrow({ direction, value }: { direction: 'up' | 'down'; value?: string }) {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        {value && <span>{value}</span>}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-500 dark:text-red-400">
      <TrendingDown className="h-3 w-3" />
      {value && <span>{value}</span>}
    </span>
  )
}

function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
  trendValue,
  loading,
  borderClass,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'warning'
  trendDirection?: 'up' | 'down'
  trendValue?: string
  loading?: boolean
  borderClass?: string
}) {
  return (
    <Card className={borderClass}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-28"><Skeleton className="h-8 w-28" /></div>
            ) : (
              <>
                <p className="text-2xl font-bold">{value}</p>
                {trendDirection && (
                  <TrendArrow direction={trendDirection} value={trendValue} />
                )}
              </>
            )}
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              trend === 'warning'
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                : trend === 'down'
                  ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { setActiveModule } = useErpStore()
  const { todayDate, greeting } = useClientDate()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  const d: DashboardData = data ?? {
    vendasHoje: 0,
    vendasMes: 0,
    totalClientes: 0,
    produtosBaixaEstoque: 0,
    vendas7Dias: [],
    topProdutos: [],
    vendasPorPagamento: [],
    produtosEstoqueBaixo: [],
    numeroVendasHoje: 0,
    ultimasVendas: [],
  }

  const ticketMedio = d.numeroVendasHoje && d.numeroVendasHoje > 0
    ? d.vendasHoje / d.numeroVendasHoje
    : 0

  // Simulated trend vs yesterday (using 7-day data if available)
  const todayVal = d.vendas7Dias.length > 0 ? d.vendas7Dias[d.vendas7Dias.length - 1]?.vendas : 0
  const yesterdayVal = d.vendas7Dias.length > 1 ? d.vendas7Dias[d.vendas7Dias.length - 2]?.vendas : 0
  const todayTrend = yesterdayVal > 0
    ? ((todayVal - yesterdayVal) / yesterdayVal * 100).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight">{greeting || 'Bem-vindo'} ao TechERP</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {todayDate || 'Carregando...'}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveModule('vendas')}>
          <ShoppingCart className="h-3.5 w-3.5" />
          Nova Venda
          <ArrowRight className="h-3 w-3 opacity-50" />
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveModule('clientes')}>
          <UserPlus className="h-3.5 w-3.5" />
          Novo Cliente
          <ArrowRight className="h-3 w-3 opacity-50" />
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveModule('produtos')}>
          <PlusCircle className="h-3.5 w-3.5" />
          Novo Produto
          <ArrowRight className="h-3 w-3 opacity-50" />
        </Button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Vendas Hoje"
          value={formatCurrency(d.vendasHoje)}
          icon={TrendingUp}
          trend="up"
          trendDirection={todayTrend ? (parseFloat(todayTrend) >= 0 ? 'up' : 'down') : undefined}
          trendValue={todayTrend ? `${todayTrend}% vs ontem` : undefined}
          loading={isLoading}
          borderClass="kpi-border-emerald"
        />
        <KpiCard
          title="Vendas do Mês"
          value={formatCurrency(d.vendasMes)}
          icon={DollarSign}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
        />
        <KpiCard
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={DollarSign}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
        />
        <KpiCard
          title="Total Clientes"
          value={String(d.totalClientes)}
          icon={Users}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
        />
        <KpiCard
          title="Estoque Baixo"
          value={String(d.produtosBaixaEstoque)}
          icon={d.produtosBaixaEstoque > 0 ? AlertTriangle : Package}
          trend={d.produtosBaixaEstoque > 0 ? 'warning' : 'up'}
          loading={isLoading}
          borderClass={d.produtosBaixaEstoque > 0 ? 'kpi-border-amber' : 'kpi-border-emerald'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendas dos Últimos 7 Dias</CardTitle>
            <CardDescription>Valores diários de venda</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                <LineChart data={d.vendas7Dias} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="dia" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="var(--color-vendas)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--color-vendas)' }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Produtos Mais Vendidos</CardTitle>
            <CardDescription>Por quantidade vendida</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                <BarChart data={d.topProdutos} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="nome" type="category" fontSize={11} tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vendas por Forma de Pagamento</CardTitle>
            <CardDescription>Distribuição no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={d.vendasPorPagamento}
                    dataKey="valor"
                    nameKey="forma"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    label={({ forma, percent }: { forma: string; percent: number }) =>
                      `${forma} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    fontSize={11}
                  >
                    {d.vendasPorPagamento.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Produtos com Estoque Baixo
            </CardTitle>
            <CardDescription>Itens abaixo do estoque mínimo</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : d.produtosEstoqueBaixo.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 mb-3">
                  <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-foreground">Tudo em ordem!</p>
                <p className="text-xs mt-1">Nenhum produto com estoque baixo no momento</p>
              </div>
            ) : (
              <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-center">Estoque</TableHead>
                      <TableHead className="text-center">Mínimo</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.produtosEstoqueBaixo.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.nome}</TableCell>
                        <TableCell className="text-center">{p.estoque}</TableCell>
                        <TableCell className="text-center">{p.estoqueMinimo}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive" className="text-xs">
                            Crítico
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas Vendas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Últimas Vendas
            </CardTitle>
            <CardDescription>5 vendas mais recentes realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !d.ultimasVendas || d.ultimasVendas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 mb-3">
                  <ShoppingCart className="h-7 w-7 text-emerald-600 dark:text-emerald-400 opacity-60" />
                </div>
                <p className="text-sm font-medium text-foreground">Nenhuma venda registrada</p>
                <p className="text-xs mt-1">As vendas aparecerão aqui conforme forem realizadas</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden sm:table-cell">Pagamento</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.ultimasVendas.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-sm">#{v.numero}</TableCell>
                        <TableCell className="text-sm">{formatDate(v.dataVenda)}</TableCell>
                        <TableCell className="text-sm">{v.clienteNome}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">{v.formaPagamento}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-medium">{formatCurrency(v.total)}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={v.status === 'FINALIZADA' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {v.status === 'FINALIZADA' ? 'Finalizada' : v.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}