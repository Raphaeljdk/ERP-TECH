'use client'

import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/helpers'

interface Categoria {
  id: string
  nome: string
  descricao: string | null
}

interface Produto {
  id: string
  codigo: string
  nome: string
  descricao: string
  precoCusto: number
  precoVenda: number
  estoqueAtual: number
  estoqueMinimo: number
  categoria: Categoria | null
  categoriaId: string | null
  codigoBarras: string
  unidade: string
  status: string
}

const UNIDADES = ['UN', 'KG', 'LT', 'M', 'CX', 'PCT', 'DZ']

export default function Produtos() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    precoCusto: 0,
    precoVenda: 0,
    estoqueMinimo: 0,
    categoriaId: '',
    codigoBarras: '',
    unidade: 'UN',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: categoriasData } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => fetch('/api/categorias').then((r) => r.json()),
  })
  const categorias: Categoria[] = categoriasData?.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['produtos', search, categoria, lowStockOnly],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.set('busca', search)
      if (categoria && categoria !== 'all') params.set('categoriaId', categoria)
      if (lowStockOnly) params.set('estoqueBaixo', 'true')
      return fetch(`/api/produtos?${params}`).then((r) => r.json())
    },
  })

  const produtos: Produto[] = data?.data ?? []

  const createMutation = useMutation({
    mutationFn: (f: typeof form) =>
      fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          categoriaId: f.categoriaId || null,
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setDialogOpen(false)
      resetForm()
      toast({ title: 'Produto criado com sucesso!' })
    },
    onError: () => toast({ title: 'Erro ao criar produto', variant: 'destructive' }),
  })

  const updateMutation = useMutation({
    mutationFn: (produto: Produto) =>
      fetch(`/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoriaId: form.categoriaId || null,
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setDialogOpen(false)
      resetForm()
      toast({ title: 'Produto atualizado com sucesso!' })
    },
    onError: () => toast({ title: 'Erro ao atualizar produto', variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/produtos/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setDeleteOpen(false)
      setDeletingId(null)
      toast({ title: 'Produto desativado com sucesso!' })
    },
    onError: () => toast({ title: 'Erro ao desativar produto', variant: 'destructive' }),
  })

  const resetForm = () => {
    setForm({ codigo: '', nome: '', descricao: '', precoCusto: 0, precoVenda: 0, estoqueMinimo: 0, categoriaId: '', codigoBarras: '', unidade: 'UN' })
    setEditing(null)
    setErrors({})
  }

  const openNew = () => { resetForm(); setDialogOpen(true) }

  const openEdit = (p: Produto) => {
    setEditing(p)
    setForm({
      codigo: p.codigo,
      nome: p.nome,
      descricao: p.descricao || '',
      precoCusto: p.precoCusto,
      precoVenda: p.precoVenda,
      estoqueMinimo: p.estoqueMinimo,
      categoriaId: p.categoriaId || '',
      codigoBarras: p.codigoBarras || '',
      unidade: p.unidade,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.codigo.trim()) e.codigo = 'Código é obrigatório'
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório'
    if (form.precoVenda <= 0) e.precoVenda = 'Preço de venda deve ser maior que zero'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editing) updateMutation.mutate(editing)
    else createMutation.mutate(form)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch id="lowstock" checked={lowStockOnly} onCheckedChange={setLowStockOnly} />
            <Label htmlFor="lowstock" className="text-sm whitespace-nowrap">Estoque baixo</Label>
          </div>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-320px)] min-h-[300px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Preço Custo</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead>Status</TableHead>
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
                  : produtos.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )
                    : produtos.map((p) => (
                        <TableRow key={p.id} className="group">
                          <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell className="hidden md:table-cell">{p.categoria?.nome || '—'}</TableCell>
                          <TableCell className="hidden lg:table-cell text-right font-mono text-sm">{formatCurrency(p.precoCusto)}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{formatCurrency(p.precoVenda)}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              p.estoqueAtual > p.estoqueMinimo
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                            }`}>
                              {p.estoqueAtual}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={p.status === 'ATIVO' ? 'default' : 'secondary'} className="text-xs">
                              {p.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => { setDeletingId(p.id); setDeleteOpen(true) }}
                                disabled={p.status !== 'ATIVO'}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm() }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>Preencha os dados do produto</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input value={form.codigo} onChange={(e) => setForm(f => ({ ...f, codigo: e.target.value }))} placeholder="PROD001" />
                {errors.codigo && <p className="text-xs text-destructive">{errors.codigo}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.nome} onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do produto" />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={form.descricao} onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descrição do produto" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preço Custo</Label>
                <Input type="number" step="0.01" value={form.precoCusto} onChange={(e) => setForm(f => ({ ...f, precoCusto: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Preço Venda *</Label>
                <Input type="number" step="0.01" value={form.precoVenda} onChange={(e) => setForm(f => ({ ...f, precoVenda: parseFloat(e.target.value) || 0 }))} />
                {errors.precoVenda && <p className="text-xs text-destructive">{errors.precoVenda}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Estoque Mínimo</Label>
                <Input type="number" value={form.estoqueMinimo} onChange={(e) => setForm(f => ({ ...f, estoqueMinimo: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.categoriaId} onValueChange={(v) => setForm(f => ({ ...f, categoriaId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Código de Barras</Label>
                <Input value={form.codigoBarras} onChange={(e) => setForm(f => ({ ...f, codigoBarras: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Select value={form.unidade} onValueChange={(v) => setForm(f => ({ ...f, unidade: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNIDADES.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar este produto? Ele não aparecerá mais nas vendas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            >
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}