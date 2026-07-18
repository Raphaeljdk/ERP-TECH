'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useErpStore, type ErpModule } from '@/store/use-erp-store'
import Dashboard from '@/components/erp/dashboard'
import Clientes from '@/components/erp/clientes'
import Produtos from '@/components/erp/produtos'
import Vendas from '@/components/erp/vendas'
import Financeiro from '@/components/erp/financeiro'
import Estoque from '@/components/erp/estoque'
import Relatorios from '@/components/erp/relatorios'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Warehouse,
  BarChart3,
  Menu,
  ChevronLeft,
  Moon,
  Sun,
  Zap,
} from 'lucide-react'
import { useTheme } from 'next-themes'

const modules: { key: ErpModule; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral' },
  { key: 'clientes', label: 'Clientes', icon: Users, description: 'Gestão de clientes' },
  { key: 'produtos', label: 'Produtos', icon: Package, description: 'Catálogo de produtos' },
  { key: 'vendas', label: 'Vendas', icon: ShoppingCart, description: 'Pedidos e vendas' },
  { key: 'financeiro', label: 'Financeiro', icon: DollarSign, description: 'Contas a pagar/receber' },
  { key: 'estoque', label: 'Estoque', icon: Warehouse, description: 'Movimentações' },
  { key: 'relatorios', label: 'Relatórios', icon: BarChart3, description: 'Análises e relatórios' },
]

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { activeModule, setActiveModule, sidebarOpen, setSidebarOpen } = useErpStore()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">TechERP</h1>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">Sistema de Gestão</p>
          </motion.div>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {modules.map((mod) => {
            const isActive = activeModule === mod.key
            const Icon = mod.icon
            return (
              <Tooltip key={mod.key} delayDuration={collapsed ? 0 : 300}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 h-10 px-3 font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => {
                      setActiveModule(mod.key)
                      onNavigate?.()
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                      <span className="truncate">{mod.label}</span>
                    )}
                    {!collapsed && isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={8}>
                    <p className="font-medium">{mod.label}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Collapse button (desktop only) */}
      <div className="p-3 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2 text-muted-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`}
          />
          {!collapsed && <span className="text-xs">Recolher</span>}
        </Button>
      </div>
    </div>
  )
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

const moduleComponents: Record<ErpModule, React.ComponentType> = {
  dashboard: Dashboard,
  clientes: Clientes,
  produtos: Produtos,
  vendas: Vendas,
  financeiro: Financeiro,
  estoque: Estoque,
  relatorios: Relatorios,
}

export default function ErpPage() {
  const { activeModule, sidebarOpen } = useErpStore()
  const mounted = useMounted()

  if (!mounted) return null

  const ActiveComponent = moduleComponents[activeModule]
  const currentModule = modules.find((m) => m.key === activeModule)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r bg-card transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-60' : 'w-[68px]'
        }`}
      >
        <SidebarContent collapsed={!sidebarOpen} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 lg:hidden h-9 w-9 bg-background/80 backdrop-blur-sm border shadow-sm"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent collapsed={false} onNavigate={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 pl-10 lg:pl-0">
            {currentModule && (
              <div className="flex items-center gap-2">
                <currentModule.icon className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{currentModule.label}</h2>
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  — {currentModule.description}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-center px-4 py-2 border-t bg-card/50 text-xs text-muted-foreground shrink-0">
          © 2025 TechERP v2.0 — Sistema de Gestão Empresarial
        </footer>
      </main>
    </div>
  )
}