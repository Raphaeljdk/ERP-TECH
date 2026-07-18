'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, ArrowDownCircle, ArrowUpCircle, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/helpers'

interface ContaFinanceira {
  id: string
  descricao: string
  cliente: { nome: string } | null
  tipo: 'RECEBER' | 'PAGAR'
  valor: number
  dataVencimento: string
  dataPagamento: string | null
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO'
  formaPagamento: string | null
}

const STATUS_STYLES: Record<string, string> = {
  PENDENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  PAGO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  ATRASADO: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

const FORMAS_PAG = ['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA']

export default function Financeiro() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'RECEBER' | 'PAGAR'>('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    descricao: '',
    clienteId: '',
    tipo: 'RECEBER' as 'RECEBER' | 'PAGAR',
    valor: 0,
    dataVencimento: '',
    formaPagamento: 'PIX',
  })

  const queryParams = new URLSearchParams()
  if (tipoFilter !== 'todos') queryParams.set('tipo', tipoFilter)
  if (statusFilter !== 'todos') queryParams.set('status', statusFilter)
  if (dataInicio) queryParams.set('dataInicio', dataInicio)
  if (dataFim) queryParams.set('dataFim', dataFim)

  // Fetch all items (unfiltered) for summary computation
  const { data: resumoData, isLoading: loadingResumo } = useQuery({
    queryKey: ['financeiro-resumo'],
    queryFn: () => fetch('/api/financeiro?limit=10000').then((r) => r.json()),
  })

  const resumo = useMemo(() => {
    const allItems: ContaFinanceira[] = resumoData?.data ?? []
    const totalReceber = allItems
      .filter((c) => c.tipo === 'RECEBER' && c.status !== 'PAGO')
      .reduce((sum, c) => sum + Number(c.valor), 0)
    const totalPagar = allItems
      .filter((c) => c.tipo === 'PAGAR' && c.status !== 'PAGO')
      .reduce((sum, c) => sum + Number(c.valor), 0)
    const totalAtraso = allItems
      .filter((c) => c.status === 'ATRASADO')
      .reduce((sum, c) => sum + Number(c.valor), 0)
    return { totalReceber, totalPagar, totalAtraso }
  }, [resumoData])

  const { data, isLoading } = useQuery({
    queryKey: ['financeiro', tipoFilter, statusFilter, dataInicio, dataFim],
    queryFn: () => fetch(`/api/financeiro?${queryParams}`).then((r) => r.json()),
  })

  const contas: ContaFinanceira[] = data?.data ?? []

  const createMutation = useMutation({
    mutationFn: () =>
      fetch('/api/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
      queryClient.invalidateQueries({ queryKey: ['financeiro-resumo'] })
      setDialogOpen(false)
      setForm({ descricao: '', clienteId: '', tipo: 'RECEBER', valor: 0, dataVencimento: '', formaPagamento: 'PIX' })
      toast({ title: 'Conta criada com sucesso!' })
    },
    onError: () => toast({ title: 'Erro ao criar conta', variant: 'destructive' }),
  })

  const pagarMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/financeiro/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAGO' }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] })
      queryClient.invalidateQueries({ queryKey: ['financeiro-resumo'] })
      toast({ title: 'Conta marcada como paga!' })
    },
    onError: () => toast({ title: 'Erro ao atualizar conta', variant: 'destructive' }),
  })

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ArrowDownCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total a Receber</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-28" /> : formatCurrency(resumo.totalReceber)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <ArrowUpCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total a Pagar</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-28" /> : formatCurrency(resumo.totalPagar)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total em Atraso</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-28" /> : formatCurrency(resumo.totalAtraso)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
          <Tabs value={tipoFilter} onValueChange={(v) => setTipoFilter(v as typeof tipoFilter)}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="RECEBER">A Receber</TabsTrigger>
              <TabsTrigger value="PAGAR">A Pagar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="PAGO">Pago</SelectItem>
              <SelectItem value="ATRASADO">Atrasado</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">De:</Label>
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-36 h-9 rounded-lg" />
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Até:</Label>
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-36 h-9 rounded-lg" />
          </div>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="btn-press rounded-lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-380px)] min-h-[300px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="table-header-row">
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : contas.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          <span className="font-semibold">Nenhuma conta encontrada</span>
                        </TableCell>
                      </TableRow>
                    )
                    : contas.map((c) => (
                        <TableRow key={c.id} className="table-row-hover">
                          <TableCell className="font-medium text-sm">{c.descricao}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{c.cliente?.nome || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`badge-elevated ${c.tipo === 'RECEBER' ? 'border-emerald-500 text-emerald-600' : 'border-red-500 text-red-600'}`}>
                              {c.tipo === 'RECEBER' ? 'Receber' : 'Pagar'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-medium">{formatCurrency(c.valor)}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{formatDate(c.dataVencimento)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status] || ''}`}>
                              {c.status === 'ATRASADO' && <AlertTriangle className="h-3 w-3" />}
                              {c.status === 'PAGO' && <CheckCircle2 className="h-3 w-3" />}
                              {c.status === 'PENDENTE' && <Clock className="h-3 w-3" />}
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{c.dataPagamento ? formatDate(c.dataPagamento) : c.formaPagamento || '—'}</TableCell>
                          <TableCell className="text-right">
                            {c.status !== 'PAGO' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="btn-press rounded-lg h-7 text-xs text-emerald-600 hover:text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                onClick={() => pagarMutation.mutate(c.id)}
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Pagar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Account Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
            <DialogDescription>Cadastre uma nova conta a receber ou pagar</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={form.descricao} onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição da conta" className="rounded-lg" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm(f => ({ ...f, tipo: v as 'RECEBER' | 'PAGAR' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEBER">A Receber</SelectItem>
                    <SelectItem value="PAGAR">A Pagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm(f => ({ ...f, valor: parseFloat(e.target.value) || 0 }))} className="rounded-lg" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Vencimento</Label>
                <Input type="date" value={form.dataVencimento} onChange={(e) => setForm(f => ({ ...f, dataVencimento: e.target.value }))} className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label>Forma Pagamento</Label>
                <Select value={form.formaPagamento} onValueChange={(v) => setForm(f => ({ ...f, formaPagamento: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORMAS_PAG.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="btn-press">Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="btn-press rounded-lg">
              Criar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}