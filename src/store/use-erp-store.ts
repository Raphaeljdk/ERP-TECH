import { create } from 'zustand'

export type ErpModule =
  | 'dashboard'
  | 'clientes'
  | 'produtos'
  | 'vendas'
  | 'financeiro'
  | 'estoque'
  | 'relatorios'

interface ErpStore {
  activeModule: ErpModule
  setActiveModule: (module: ErpModule) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useErpStore = create<ErpStore>((set) => ({
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))