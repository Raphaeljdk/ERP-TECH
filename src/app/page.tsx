'use client'

import { useSyncExternalStore } from 'react'
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
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shrink-0 shadow-md shadow-primary/20">
          <Zap className="w-5 h-5" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold tracking-tight whitespace-nowrap gradient-text">TechERP</h1>
            <p className="text-[10px] text-muted-foreground/70 whitespace-nowrap font-medium tracking-wide uppercase">Gestão Empresarial</p>
          </motion.div>
        )}
      </div>

      <Separator className="opacity-60" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-0.5">
          {modules.map((mod) => {
            const isActive = activeModule === mod.key
            const Icon = mod.icon
            return (
              <Tooltip key={mod.key} delayDuration={collapsed ? 0 : 400}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-10 px-3 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'nav-item-active shadow-sm'
                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
                    }`}
                    onClick={() => {
                      setActiveModule(mod.key)
                      onNavigate?.()
                    }}
                  >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {!collapsed && (
                      <span className="text-[13px]">{mod.label}</span>
                    )}
                    {!collapsed && isActive && (
                      <motion.div
                        layoutId="sidebar-active-dot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10} className="text-xs">
                    <p className="font-semibold">{mod.label}</p>
                    <p className="text-muted-foreground">{mod.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="opacity-60" />

      {/* Collapse button (desktop only) */}
      <div className="p-3 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2 text-muted-foreground/60 hover:text-muted-foreground h-8 text-xs"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
          />
          {!collapsed && <span>Recolher</span>}
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
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) return <div className="w-9 h-9" />

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg btn-press"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
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
        className={`hidden lg:flex flex-col sidebar-glass transition-all duration-300 ease-in-out ${
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
            className="fixed top-3 left-3 z-50 lg:hidden h-9 w-9 glass-card rounded-lg border shadow-sm"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 sidebar-glass border-0">
          <SidebarContent collapsed={false} onNavigate={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b bg-card/60 backdrop-blur-md shrink-0 gradient-border-bottom">
          <div className="flex items-center gap-3 pl-10 lg:pl-0">
            {currentModule && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary">
                  <currentModule.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-none">{currentModule.label}</h2>
                  <span className="hidden sm:inline text-[11px] text-muted-foreground leading-none mt-0.5 block">
                    {currentModule.description}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto main-gradient-bg">
          <div className="p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-center px-4 py-2 border-t bg-card/40 backdrop-blur-sm text-[11px] text-muted-foreground/60 shrink-0">
          <span>© 2025 TechERP v2.0</span>
          <span className="mx-2 opacity-30">·</span>
          <span>Sistema de Gestão Empresarial</span>
        </footer>
      </main>
    </div>
  )
}