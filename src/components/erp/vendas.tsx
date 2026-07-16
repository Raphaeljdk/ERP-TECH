'use client'

import { useState, useMemo } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Search, Plus, Minus, ShoppingCart, Trash2, CheckCircle2, UserCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/helpers'

interface Produto {
  id: string
  codigo: string
  nome: string
  precoVenda: number
  estoqueAtual: number
  unidade: string
}

interface Cliente {
  id: string
  nome: string
  cpf: string
}

interface CartItem {
  produto: Produto
  quantidade: number
}

interface VendaRecente {
  id: string
  numero: string
  cliente: { nome: string } | null
  total: number
  formaPagamento: string
  dataVenda: string
}

const FORMAS_PAGAMENTO = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'CARTAO_CREDITO', label: 'Cartão Crédito' },
  { value: 'CARTAO_DEBITO', label: 'Cartão Débito' },
  { value: 'PIX', label: 'PIX' },
  { value: 'BOLETO', label: 'Boleto' },
]

export default function Vendas() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [clienteId, setClienteId] = useState<string>('__consumidor_final__')
  const [clienteSearch, setClienteSearch] = useState('')
  const [discount, setDiscount] = useState(0)
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: produtosData, isLoading: loadingProdutos } = useQuery({
    queryKey: ['produtos-pdv', search],
    queryFn: () =>
      fetch(`/api/produtos?busca=${encodeURIComponent(search)}&limit=20`).then((r) => r.json()),
  })
  const produtos: Produto[] = produtosData?.data ?? []

  const { data: clientesData } = useQuery({
    queryKey: ['clientes-pdv', clienteSearch],
    queryFn: () =>
      fetch(`/api/clientes?busca=${encodeURIComponent(clienteSearch)}&limit=10`).then((r) => r.json()),
    enabled: clienteSearch.length > 0,
  })
  const clientes: Cliente[] = clientesData?.data ?? []

  const { data: vendasData } = useQuery({
    queryKey: ['vendas-recentes'],
    queryFn: () => fetch('/api/vendas?limit=10').then((r) => r.json()),
  })
  const vendasRecentes: VendaRecente[] = vendasData?.data ?? []

  const finishMutation = useMutation({
    mutationFn: () =>
      fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: clienteId === '__consumidor_final__' ? null : clienteId,
          itens: cart.map((c) => ({ produtoId: c.produto.id, quantidade: c.quantidade })),
          desconto: discount,
          formaPagamento,
        }),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendas-recentes'] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setCart([])
      setDiscount(0)
      setClienteId('__consumidor_final__')
      setConfirmOpen(false)
      toast({ title: `Venda #${data?.numero || 'realizada'} finalizada com sucesso!` })
    },
    onError: () => toast({ title: 'Erro ao finalizar venda', variant: 'destructive' }),
  })

  const addToCart = (produto: Produto) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.produto.id === produto.id)
      if (existing) {
        if (existing.quantidade >= produto.estoqueAtual) {
          toast({ title: 'Estoque insuficiente', variant: 'destructive' })
          return prev
        }
        return prev.map((c) =>
          c.produto.id === produto.id ? { ...c, quantidade: c.quantidade + 1 } : c
        )
      }
      return [...prev, { produto, quantidade: 1 }]
    })
  }

  const updateQty = (produtoId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.produto.id !== produtoId) return c
          const newQty = c.quantidade + delta
          if (newQty <= 0) return null
          if (newQty > c.produto.estoqueAtual) return c
          return { ...c, quantidade: newQty }
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeItem = (produtoId: string) => {
    setCart((prev) => prev.filter((c) => c.produto.id !== produtoId))
  }

  const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.produto.precoVenda * c.quantidade, 0), [cart])
  const grandTotal = Math.max(0, subtotal - discount)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Left: Product Search */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Buscar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Digite o nome ou código do produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {loadingProdutos
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 w-16 bg-muted animate-pulse rounded mb-3" />
                      <div className="h-8 w-full bg-muted animate-pulse rounded" />
                    </div>
                  ))
                : produtos.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border p-4 hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer group"
                      onClick={() => addToCart(p)}
                    >
                      <p className="font-medium text-sm truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.codigo} · Estoque: {p.estoqueAtual}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold text-sm">{formatCurrency(p.precoVenda)}</span>
                        <Button size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-3 w-3 mr-1" /> Adicionar
                        </Button>
                      </div>
                    </div>
                  ))}
              {produtos.length === 0 && !loadingProdutos && (
                <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell">Pagamento</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendasRecentes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-sm">
                        Nenhuma venda recente
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendasRecentes.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-sm">#{v.numero}</TableCell>
                        <TableCell>{v.cliente?.nome || 'Consumidor Final'}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">{v.formaPagamento}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(v.total)}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{formatDate(v.dataVenda)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Cart */}
      <div className="space-y-4">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Carrinho ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Client selector */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cliente</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm h-9">
                    <UserCheck className="mr-2 h-3.5 w-3.5" />
                    {clienteId === '__consumidor_final__' ? 'Consumidor Final' : cart.length >= 0 ? 'Selecionar cliente' : 'Consumidor Final'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-2" align="start">
                  <Input
                    placeholder="Buscar cliente..."
                    value={clienteSearch}
                    onChange={(e) => setClienteSearch(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm ${clienteId === '__consumidor_final__' ? 'bg-accent' : ''}`}
                    onClick={() => setClienteId('__consumidor_final__')}
                  >
                    Consumidor Final
                  </Button>
                  <Separator className="my-1" />
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    {clientes.map((c) => (
                      <Button
                        key={c.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-sm ${clienteId === c.id ? 'bg-accent' : ''}`}
                        onClick={() => { setClienteId(c.id); setClienteSearch('') }}
                      >
                        {c.nome}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* Cart items */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  Carrinho vazio
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.produto.id} className="flex items-center gap-2 rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.produto.nome}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.produto.precoVenda)} × {item.quantidade}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produto.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produto.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 ml-1" onClick={() => removeItem(item.produto.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-muted-foreground whitespace-nowrap">Desconto (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-28 h-8 text-right"
                  placeholder="0,00"
                />
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="font-mono text-primary">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMAS_PAGAMENTO.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={cart.length === 0 || finishMutation.isPending}
              onClick={() => setConfirmOpen(true)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar Venda
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Venda</DialogTitle>
            <DialogDescription>Revise os dados antes de finalizar</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Itens</span>
              <span>{cart.length} produto(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Desconto</span>
                <span className="font-mono">-{formatCurrency(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="font-mono text-primary">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagamento</span>
              <span>{FORMAS_PAGAMENTO.find((f) => f.value === formaPagamento)?.label}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={() => finishMutation.mutate()} disabled={finishMutation.isPending}>
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}