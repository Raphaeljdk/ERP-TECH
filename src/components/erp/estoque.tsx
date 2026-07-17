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
import { Skeleton } from '@/components/ui/skeleton'
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
import { Plus, Package, Warehouse, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/helpers'

interface MovimentacaoEstoque {
  id: string
  createdAt: string
  produto: { nome: string } | null
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE'
  quantidade: number
  estoqueAntes: number
  estoqueDepois: number
  motivo: string | null
}

interface ProdutoItem {
  id: string
  nome: string
  estoqueAtual: number
  estoqueMinimo: number
}

const TIPO_STYLES: Record<string, string> = {
  ENTRADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  SAIDA: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  AJUSTE: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
}

const TIPO_LABELS: Record<string, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE: 'Ajuste',
}

export default function Estoque() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [produtoFilter, setProdutoFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    tipo: 'ENTRADA' as 'ENTRADA' | 'SAIDA' | 'AJUSTE',
    produtoId: '',
    quantidade: 0,
    motivo: '',
  })

  const { data: produtosResumoData, isLoading: loadingResumo } = useQuery({
    queryKey: ['estoque-resumo-produtos'],
    queryFn: () => fetch('/api/produtos?limit=10000&status=ATIVO').then((r) => r.json()),
  })

  const resumo = useMemo(() => {
    const allProdutos: ProdutoItem[] = produtosResumoData?.data ?? []
    const totalProdutos = allProdutos.length
    const itensEmEstoque = allProdutos.reduce((sum, p) => sum + (p.estoqueAtual || 0), 0)
    const produtosBaixoEstoque = allProdutos.filter((p) => p.estoqueAtual <= p.estoqueMinimo).length
    return { totalProdutos, itensEmEstoque, produtosBaixoEstoque }
  }, [produtosResumoData])

  const { data: produtosData } = useQuery({
    queryKey: ['produtos-select'],
    queryFn: () => fetch('/api/produtos?limit=100').then((r) => r.json()),
  })
  const produtos: ProdutoItem[] = produtosData?.data ?? []

  const params = new URLSearchParams()
  if (produtoFilter !== 'all') params.set('produtoId', produtoFilter)

  const { data, isLoading } = useQuery({
    queryKey: ['estoque-movimentacoes', produtoFilter],
    queryFn: () => fetch(`/api/estoque?${params}`).then((r) => r.json()),
  })

  const movimentacoes: MovimentacaoEstoque[] = data?.data ?? []

  const createMutation = useMutation({
    mutationFn: () =>
      fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque-movimentacoes'] })
      queryClient.invalidateQueries({ queryKey: ['estoque-resumo-produtos'] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setDialogOpen(false)
      setForm({ tipo: 'ENTRADA', produtoId: '', quantidade: 0, motivo: '' })
      toast({ title: 'Movimentação registrada com sucesso!' })
    },
    onError: () => toast({ title: 'Erro ao registrar movimentação', variant: 'destructive' }),
  })

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Produtos</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-16" /> : resumo.totalProdutos}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Warehouse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Itens em Estoque</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-16" /> : resumo.itensEmEstoque}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Produtos Baixo Estoque</p>
                <div className="text-lg font-bold">{loadingResumo ? <Skeleton className="h-6 w-16" /> : resumo.produtosBaixoEstoque}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">Filtrar por produto:</Label>
          <Select value={produtoFilter} onValueChange={setProdutoFilter}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Todos os produtos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os produtos</SelectItem>
              {produtos.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-380px)] min-h-[300px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Antes</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Depois</TableHead>
                  <TableHead className="hidden md:table-cell">Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : movimentacoes.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhuma movimentação encontrada
                        </TableCell>
                      </TableRow>
                    )
                    : movimentacoes.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm">{formatDate(m.createdAt)}</TableCell>
                          <TableCell className="font-medium">{m.produto?.nome || '—'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TIPO_STYLES[m.tipo] || ''}`}>
                              {TIPO_LABELS[m.tipo]}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            <span className={m.tipo === 'SAIDA' ? 'text-red-500' : 'text-emerald-600'}>
                              {m.tipo === 'SAIDA' ? '-' : '+'}{m.quantidade}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-mono hidden sm:table-cell">{m.estoqueAntes}</TableCell>
                          <TableCell className="text-center font-mono hidden sm:table-cell">{m.estoqueDepois}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{m.motivo || '—'}</TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Movement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>Registre uma entrada, saída ou ajuste de estoque</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm(f => ({ ...f, tipo: v as 'ENTRADA' | 'SAIDA' | 'AJUSTE' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                  <SelectItem value="AJUSTE">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select value={form.produtoId} onValueChange={(v) => setForm(f => ({ ...f, produtoId: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input type="number" min={1} value={form.quantidade} onChange={(e) => setForm(f => ({ ...f, quantidade: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Input value={form.motivo} onChange={(e) => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Motivo da movimentação" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.produtoId || form.quantidade <= 0}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}