'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useErpStore, type ErpModule } from '@/store/use-erp-store'
import Dashboard from '@/components/erp/dashboard'
import Clientes from '@/components/erp/clientes'
import Produtos from '@/components/erp/produtos'
