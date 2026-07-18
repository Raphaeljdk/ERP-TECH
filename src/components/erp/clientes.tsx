'use client'

import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Search, Plus, Pencil, Trash2, Download, Users, UserCheck, UserX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { maskCPF, validateCPF, formatCPF } from '@/lib/helpers'

interface Cliente {
  id: string
  nome: string
  cpf: string
  email: string
  telefone: string
  celular: string
  dataNascimento: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  limiteCredito: number
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO'
}

const emptyCliente: Omit<Cliente, 'id'> = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  celular: '',
  dataNascimento: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  limiteCredito: 0,
  status: 'ATIVO',
}

const STATUS_STYLES: Record<string, string> = {
  ATIVO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  INATIVO: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  BLOQUEADO: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
}

const ESTADOS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

export default function Clientes() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyCliente)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ['clientes', debouncedSearch, page],
    queryFn: () =>
      fetch(`/api/clientes?busca=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=10`).then((r) =>
        r.json()
      ),
  })

  const clientes: Cliente[] = data?.data ?? []
  const total: number = data?.pagination?.total ?? 0
  const totalPages: number = Math.ceil(total / 10)

  const createMutation = useMutation({
    mutationFn: (cliente: Omit<Cliente, 'id'>) =>
      fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      setDialogOpen(false)
      resetForm()
      toast({ title: 'Cliente criado com sucesso!' })
    },
    onError: () => {
      toast({ title: 'Erro ao criar cliente', variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (cliente: Cliente) =>
      fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      setDialogOpen(false)
      resetForm()
      toast({ title: 'Cliente atualizado com sucesso!' })
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar cliente', variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/clientes/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      setDeleteOpen(false)
      setDeletingId(null)
      toast({ title: 'Cliente excluído com sucesso!' })
    },
    onError: () => {
      toast({ title: 'Erro ao excluir cliente', variant: 'destructive' })
    },
  })

  const resetForm = () => {
    setForm(emptyCliente)
    setEditingCliente(null)
    setFormErrors({})
  }

  const openNew = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setForm(cliente)
    setFormErrors({})
    setDialogOpen(true)
  }

  const openDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!form.nome.trim()) errors.nome = 'Nome é obrigatório'
    if (!form.cpf.replace(/\D/g, '')) errors.cpf = 'CPF é obrigatório'
    else if (!validateCPF(form.cpf)) errors.cpf = 'CPF inválido'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    if (editingCliente) {
      updateMutation.mutate({ ...editingCliente, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  const exportCSV = useCallback(() => {
    const headers = ['Nome', 'CPF', 'Telefone', 'Email', 'Status']
    const rows = clientes.map((c) => [c.nome, formatCPF(c.cpf), c.telefone, c.email, c.status])
    const csv = [headers, ...rows].map((r) => r.join(';')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clientes.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'CSV exportado com sucesso!' })
  }, [clientes, toast])

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const ativos = clientes.filter((c) => c.status === 'ATIVO').length
  const inativos = clientes.filter((c) => c.status !== 'ATIVO').length

  function getInitials(name: string) {
    return name
      .split(' ')
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card stat-card flex items-center gap-2 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-sm font-bold">{isLoading ? '—' : total}</p>
          </div>
        </div>
        <div className="glass-card stat-card flex items-center gap-2 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ativos</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{isLoading ? '—' : ativos}</p>
          </div>
        </div>
        <div className="glass-card stat-card flex items-center gap-2 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <UserX className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inativos</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{isLoading ? '—' : inativos}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9 rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="btn-press" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button size="sm" className="btn-press rounded-lg" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-320px)] min-h-[300px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="table-header-row">
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  : clientes.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="glass-card flex h-14 w-14 items-center justify-center rounded-full mb-3">
                              <Users className="h-7 w-7 opacity-50" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Nenhum cliente encontrado</p>
                            <p className="text-xs mt-1">Tente ajustar os termos de busca</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                    : clientes.map((c) => (
                        <TableRow key={c.id} className="table-row-hover">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold ring-2 ring-primary/20">
                                {getInitials(c.nome)}
                              </div>
                              <span className="text-sm font-medium">{c.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">{formatCPF(c.cpf)}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{c.telefone}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{c.email}</TableCell>
                          <TableCell>
                            <span className={`badge-elevated inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                              {c.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 btn-press" onClick={() => openEdit(c)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 btn-press" onClick={() => openDelete(c.id)}>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="btn-press" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button variant="outline" size="sm" className="btn-press" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Próxima
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <Card className="glass-card border-0 shadow-none">
            <CardHeader>
              <CardTitle>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
              <DialogDescription>Preencha os dados do cliente</DialogDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input value={form.nome} onChange={(e) => updateField('nome', e.target.value)} placeholder="Nome completo" />
                    {formErrors.nome && <p className="text-xs text-destructive">{formErrors.nome}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>CPF *</Label>
                    <Input value={form.cpf} onChange={(e) => updateField('cpf', maskCPF(e.target.value))} placeholder="000.000.000-00" />
                    {formErrors.cpf && <p className="text-xs text-destructive">{formErrors.cpf}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.telefone} onChange={(e) => updateField('telefone', e.target.value)} placeholder="(00) 0000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Celular</Label>
                    <Input value={form.celular} onChange={(e) => updateField('celular', e.target.value)} placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Data Nascimento</Label>
                    <Input type="date" value={form.dataNascimento} onChange={(e) => updateField('dataNascimento', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATIVO">Ativo</SelectItem>
                        <SelectItem value="INATIVO">Inativo</SelectItem>
                        <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Limite de Crédito</Label>
                  <Input type="number" step="0.01" value={form.limiteCredito} onChange={(e) => updateField('limiteCredito', parseFloat(e.target.value) || 0)} />
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Endereço</p>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-2 sm:col-span-1">
                      <Label>CEP</Label>
                      <Input value={form.cep} onChange={(e) => updateField('cep', e.target.value)} placeholder="00000-000" />
                    </div>
                    <div className="space-y-2 sm:col-span-3">
                      <Label>Logradouro</Label>
                      <Input value={form.logradouro} onChange={(e) => updateField('logradouro', e.target.value)} placeholder="Rua, Avenida..." />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4 mt-3">
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input value={form.numero} onChange={(e) => updateField('numero', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Complemento</Label>
                      <Input value={form.complemento} onChange={(e) => updateField('complemento', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input value={form.bairro} onChange={(e) => updateField('bairro', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input value={form.cidade} onChange={(e) => updateField('cidade', e.target.value)} />
                    </div>
                  </div>
                  <div className="mt-3 sm:w-32">
                    <Label>Estado</Label>
                    <Select value={form.estado} onValueChange={(v) => updateField('estado', v)}>
                      <SelectTrigger className="mt-2"><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="btn-press" onClick={() => { setDialogOpen(false); resetForm() }}>Cancelar</Button>
                <Button className="btn-press" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCliente ? 'Salvar' : 'Criar'}
                </Button>
              </DialogFooter>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white btn-press"
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}