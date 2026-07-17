# Task: fix-mismatches - Frontend API Alignment Agent

## Status: COMPLETED

## Summary
Fixed all critical mismatches between frontend ERP components and their API routes.

## Changes Made

### 1. clientes.tsx - 4 fixes
- `search=` → `busca=`
- `data?.clientes` → `data?.data`
- `data?.total` → `data?.pagination?.total`
- PUT/DELETE URL: `?id=` → `/${id}`

### 2. produtos.tsx - Full rewrite (12+ fixes)
- Query params: `search`→`busca`, `categoria`→`categoriaId`, `lowStock`→`estoqueBaixo`
- Response: `data?.produtos` → `data?.data`
- Categorias: `data?.categorias` → `data?.data`
- Interface: `estoque`→`estoqueAtual`, `ativo:bool`→`status:string`, `categoria:string`→`categoria:object|null`
- Form: uses `categoriaId` instead of `categoria`
- PUT/DELETE URLs fixed

### 3. vendas.tsx - 8 fixes
- All query params: `search`→`busca`
- All response parsing: `?.produtos/?.clientes/?.vendas` → `?.data`
- Produto.estoque → Produto.estoqueAtual
- VendaRecente.clienteNome → VendaRecente.cliente?.nome
- VendaRecente.data → VendaRecente.dataVenda

### 4. financeiro.tsx - Full rewrite (8 fixes)
- Response: `data?.contas` → `data?.data`
- PUT URL: `/api/financeiro?id=` → `/api/financeiro/` with PUT method
- Interface: clienteNome→cliente object, vencimento→dataVencimento
- Replaced non-existent /api/financeiro/resumo with computed summary

### 5. estoque.tsx - Full rewrite (7 fixes)
- Response: `data?.movimentacoes` → `data?.data`
- Produtos response: `data?.produtos` → `data?.data`
- Interface: data→createdAt, produtoNome→produto.nome
- Replaced non-existent /api/estoque/resumo with computed summary

### 6. relatorios.tsx - Full rewrite (12+ fixes)
- Report types: `vendas-periodo`→`vendas-por-periodo`, `produtos-vendidos`→`produtos-mais-vendidos`
- Date params: `dataInicio/dataFim` → `startDate/endDate`
- All response parsing: `?.vendas/?.produtos/?.clientes` → `?.data`
- All field names aligned with actual API response shapes
- Only vendas-por-periodo needs date selection

### 7. helpers.ts - Verified (no changes needed)
All exports (formatCurrency, formatDate, formatCPF, maskCPF, validateCPF, cn) are correct.

## Verification
- `bun run lint` passes with 0 errors
- Dev server running without issues
