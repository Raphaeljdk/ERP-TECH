'use client'

import { useState, useEffect, useRef } from 'react'
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
  vendas: { label: 'Vendas', color: 'oklch(0.52 0.16 155)' },
} satisfies ChartConfig

const barChartConfig = {
  quantidade: { label: 'Quantidade', color: 'oklch(0.52 0.16 155)' },
} satisfies ChartConfig

const pieChartConfig = {
  dinheiro: { label: 'Dinheiro', color: 'oklch(0.52 0.16 155)' },
  credito: { label: 'Cartão Crédito', color: 'oklch(0.62 0.16 145)' },
  debito: { label: 'Cartão Débito', color: 'oklch(0.72 0.13 160)' },
  pix: { label: 'PIX', color: 'oklch(0.42 0.19 150)' },
  boleto: { label: 'Boleto', color: 'oklch(0.82 0.08 155)' },
} satisfies ChartConfig

const PIE_COLORS = [
  'oklch(0.52 0.16 155)',
  'oklch(0.62 0.16 145)',
  'oklch(0.72 0.13 160)',
  'oklch(0.42 0.19 150)',
  'oklch(0.82 0.08 155)',
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
  const [state, setState] = useState<{ todayDate: string; greeting: string }>({ todayDate: '', greeting: '' })
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const now = new Date()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      todayDate: now.toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
      greeting: now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite',
    })
  }, [])

  return state
}

function TrendArrow({ direction, value }: { direction: 'up' | 'down'; value?: string }) {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
        <TrendingUp className="h-3 w-3" />
        {value && <span>{value}</span>}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded-md">
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
  delay = 0,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'warning'
  trendDirection?: 'up' | 'down'
  trendValue?: string
  loading?: boolean
  borderClass?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={`glass-card kpi-card ${borderClass || ''} ${trend === 'up' ? 'kpi-glow-emerald' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
              {loading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <p className="text-[22px] font-bold tracking-tight leading-none">{value}</p>
              )}
              {trendDirection && !loading && (
                <div className="pt-0.5">
                  <TrendArrow direction={trendDirection} value={trendValue} />
                </div>
              )}
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                trend === 'warning'
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 shadow-sm'
                  : trend === 'down'
                    ? 'bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400 shadow-sm'
                    : 'bg-primary/10 text-primary shadow-sm'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {greeting || 'Bem-vindo'} ao <span className="gradient-text">TechERP</span>
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
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
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-lg btn-press hover:border-primary/30 hover:bg-primary/5"
          onClick={() => setActiveModule('vendas')}
        >
          <ShoppingCart className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Nova Venda</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-lg btn-press hover:border-primary/30 hover:bg-primary/5"
          onClick={() => setActiveModule('clientes')}
        >
          <UserPlus className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Novo Cliente</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-lg btn-press hover:border-primary/30 hover:bg-primary/5"
          onClick={() => setActiveModule('produtos')}
        >
          <PlusCircle className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Novo Produto</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
        </Button>
      </motion.div>

      {/* KPI Grid */}
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
          delay={0.05}
        />
        <KpiCard
          title="Vendas do Mês"
          value={formatCurrency(d.vendasMes)}
          icon={DollarSign}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
          delay={0.1}
        />
        <KpiCard
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          icon={DollarSign}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
          delay={0.15}
        />
        <KpiCard
          title="Total Clientes"
          value={String(d.totalClientes)}
          icon={Users}
          trend="up"
          loading={isLoading}
          borderClass="kpi-border-emerald"
          delay={0.2}
        />
        <KpiCard
          title="Estoque Baixo"
          value={String(d.produtosBaixaEstoque)}
          icon={d.produtosBaixaEstoque > 0 ? AlertTriangle : Package}
          trend={d.produtosBaixaEstoque > 0 ? 'warning' : 'up'}
          loading={isLoading}
          borderClass={d.produtosBaixaEstoque > 0 ? 'kpi-border-amber' : 'kpi-border-emerald'}
          delay={0.25}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Vendas dos Últimos 7 Dias</CardTitle>
              <CardDescription className="text-xs">Valores diários de venda</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full rounded-lg" />
              ) : (
                <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
                  <LineChart data={d.vendas7Dias} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="dia" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.45 0.02 155)' }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'oklch(0.45 0.02 155)' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="vendas"
                      stroke="var(--color-vendas)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: 'var(--color-vendas)', strokeWidth: 2, stroke: 'oklch(1 0 0)' }}
                      activeDot={{ r: 6, fill: 'var(--color-vendas)', strokeWidth: 2, stroke: 'oklch(1 0 0)' }}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top 5 Produtos Mais Vendidos</CardTitle>
              <CardDescription className="text-xs">Por quantidade vendida</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full rounded-lg" />
              ) : (
                <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                  <BarChart data={d.topProdutos} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'oklch(0.45 0.02 155)' }} />
                    <YAxis dataKey="nome" type="category" fontSize={11} tickLine={false} axisLine={false} width={120} tick={{ fill: 'oklch(0.35 0.02 155)' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Vendas por Forma de Pagamento</CardTitle>
              <CardDescription className="text-xs">Distribuição no mês atual</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full rounded-lg" />
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Produtos com Estoque Baixo
              </CardTitle>
              <CardDescription className="text-xs">Itens abaixo do estoque mínimo</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : d.produtosEstoqueBaixo.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 mb-3">
                    <Package className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Tudo em ordem!</p>
                  <p className="text-xs mt-1 text-muted-foreground">Nenhum produto com estoque baixo</p>
                </div>
              ) : (
                <div className="max-h-[250px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="table-header-row">
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Estoque</TableHead>
                        <TableHead className="text-center">Mínimo</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {d.produtosEstoqueBaixo.map((p) => (
                        <TableRow key={p.id} className="table-row-hover">
                          <TableCell className="font-medium text-sm">{p.nome}</TableCell>
                          <TableCell className="text-center font-mono text-sm">{p.estoque}</TableCell>
                          <TableCell className="text-center font-mono text-sm text-muted-foreground">{p.estoqueMinimo}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="destructive" className="text-[10px] font-semibold badge-elevated">
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
        </motion.div>
      </div>

      {/* Últimas Vendas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Últimas Vendas
            </CardTitle>
            <CardDescription className="text-xs">5 vendas mais recentes realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : !d.ultimasVendas || d.ultimasVendas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-3">
                  <ShoppingCart className="h-7 w-7 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-foreground">Nenhuma venda registrada</p>
                <p className="text-xs mt-1 text-muted-foreground">As vendas aparecerão aqui conforme forem realizadas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header-row">
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
                      <TableRow key={v.id} className="table-row-hover">
                        <TableCell className="font-mono text-xs text-muted-foreground">#{v.numero}</TableCell>
                        <TableCell className="text-sm">{formatDate(v.dataVenda)}</TableCell>
                        <TableCell className="text-sm font-medium">{v.clienteNome}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-[10px] font-medium badge-elevated whitespace-nowrap">{v.formaPagamento}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold">{formatCurrency(v.total)}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={v.status === 'FINALIZADA' ? 'default' : 'secondary'}
                            className="text-[10px] font-semibold badge-elevated"
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