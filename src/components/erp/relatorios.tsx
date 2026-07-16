'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { FileBarChart2 } from 'lucide-react'
import { formatCurrency } from '@/lib/helpers'

type ReportType = 'vendas-por-periodo' | 'produtos-mais-vendidos' | 'clientes-fieis' | 'lucratividade'

const REPORT_TYPES: { value: ReportType; label: string; needsDates: boolean }[] = [
  { value: 'vendas-por-periodo', label: 'Vendas por Período', needsDates: true },
  { value: 'produtos-mais-vendidos', label: 'Produtos Mais Vendidos', needsDates: false },
  { value: 'clientes-fieis', label: 'Clientes Fiéis', needsDates: false },
  { value: 'lucratividade', label: 'Lucratividade', needsDates: false },
]

const lineConfig = {
  total: { label: 'Total Vendas', color: 'oklch(0.55 0.15 155)' },
} satisfies ChartConfig

const barConfig = {
  quantidadeVendida: { label: 'Quantidade Vendida', color: 'oklch(0.55 0.15 155)' },
} satisfies ChartConfig

export default function Relatorios() {
  const [reportType, setReportType] = useState<ReportType>('vendas-por-periodo')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [generated, setGenerated] = useState(false)

  const selectedReport = REPORT_TYPES.find((r) => r.value === reportType)

  const params = new URLSearchParams({ tipo: reportType })
  if (dataInicio) params.set('startDate', dataInicio)
  if (dataFim) params.set('endDate', dataFim)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['relatorio', reportType, dataInicio, dataFim],
    queryFn: () => fetch(`/api/relatorios?${params}`).then((r) => r.json()),
    enabled: generated && (selectedReport?.needsDates ? !!(dataInicio && dataFim) : true),
  })

  const handleGenerate = () => {
    if (selectedReport?.needsDates && (!dataInicio || !dataFim)) return
    setGenerated(true)
  }

  const getMarginColor = (margem: number): string => {
    if (margem >= 30) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
    if (margem >= 15) return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileBarChart2 className="h-4 w-4" />
            Gerador de Relatórios
          </CardTitle>
          <CardDescription>Selecione o tipo de relatório e período desejado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(v) => { setReportType(v as ReportType); setGenerated(false) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedReport?.needsDates && (
              <>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                </div>
              </>
            )}
            <div className="flex items-end">
              <Button onClick={handleGenerate} className="w-full" disabled={isFetching}>
                {isFetching ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {generated && (
        <>
          {/* Vendas por Período */}
          {reportType === 'vendas-por-periodo' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendas por Período</CardTitle>
                <CardDescription>Total de vendas diárias no período selecionado</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : !data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileBarChart2 className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Nenhum dado encontrado para o período</p>
                  </div>
                ) : (
                  <ChartContainer config={lineConfig} className="h-[300px] w-full">
                    <LineChart data={data.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="data" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-total)' }} />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Produtos Mais Vendidos */}
          {reportType === 'produtos-mais-vendidos' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Produtos Mais Vendidos</CardTitle>
                <CardDescription>Ranking de produtos por quantidade vendida</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : !data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileBarChart2 className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Nenhum dado encontrado</p>
                  </div>
                ) : (
                  <ChartContainer config={barConfig} className="h-[300px] w-full">
                    <BarChart data={data.data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                      <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis dataKey="nome" type="category" fontSize={10} tickLine={false} axisLine={false} width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="quantidadeVendida" fill="var(--color-quantidadeVendida)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Clientes Fiéis */}
          {reportType === 'clientes-fieis' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clientes Fiéis</CardTitle>
                <CardDescription>Top clientes por valor total de compras</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileBarChart2 className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Nenhum dado encontrado</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead className="hidden md:table-cell">CPF</TableHead>
                          <TableHead className="text-center">Nº Vendas</TableHead>
                          <TableHead className="text-right">Total Compras</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.data.map((c: { nome: string; cpf: string; numeroVendas: number; totalCompras: number }, i: number) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0 text-xs">
                                {i + 1}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{c.nome}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-sm">{c.cpf || '—'}</TableCell>
                            <TableCell className="text-center">{c.numeroVendas}</TableCell>
                            <TableCell className="text-right font-mono text-sm">{formatCurrency(c.totalCompras)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Lucratividade */}
          {reportType === 'lucratividade' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lucratividade por Produto</CardTitle>
                <CardDescription>Análise de margem de lucro por produto</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileBarChart2 className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Nenhum dado encontrado</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">Preço Custo</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">Preço Venda</TableHead>
                          <TableHead className="text-right">Lucro Total</TableHead>
                          <TableHead className="text-center">Margem</TableHead>
                          <TableHead className="text-center hidden md:table-cell">Qtd Vendida</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.data.map((p: { nome: string; precoCusto: number; precoVenda: number; lucroTotal: number; margemPercentual: number; quantidadeVendida: number }, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{p.nome}</TableCell>
                            <TableCell className="text-right font-mono text-sm hidden sm:table-cell">{formatCurrency(p.precoCusto)}</TableCell>
                            <TableCell className="text-right font-mono text-sm hidden sm:table-cell">{formatCurrency(p.precoVenda)}</TableCell>
                            <TableCell className={`text-right font-mono text-sm font-medium ${p.lucroTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {formatCurrency(p.lucroTotal)}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMarginColor(p.margemPercentual)}`}>
                                {p.margemPercentual.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm hidden md:table-cell">{p.quantidadeVendida}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}