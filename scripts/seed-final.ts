import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const FINAL: { cat: string; items: { nome: string; custo: number; venda: number; unidade: string }[] }[] = [
  { cat: 'Hubs USB', items: [
    { nome: 'Hub USB-C Anker 555 8-in-1 USB-C', custo: 280, venda: 429, unidade: 'UN' },
    { nome: 'Hub USB-C Satechi Multi-Port Adapter V3', custo: 400, venda: 599, unidade: 'UN' },
    { nome: 'Hub USB 3.0 10 Portas AC Powered', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Hub USB-C 6 em 1 UGREEN', custo: 140, venda: 219, unidade: 'UN' },
    { nome: 'Dock Station USB-C Dell WD19S', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Hub USB-C Baseus 8 em 1 HDMI PD', custo: 160, venda: 249, unidade: 'UN' },
    { nome: 'Dock USB-C Targus DOCK190AUZ', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Hub USB 3.0 4 Portas Compacto', custo: 40, venda: 69, unidade: 'UN' },
    { nome: 'Dock Station USB-C UGREEN Revodok Pro 210', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Hub USB-C 4 Portas Anker A2667', custo: 200, venda: 319, unidade: 'UN' },
  ]},
  { cat: 'HDs Externos', items: [
    { nome: 'HD Externo WD Elements 4TB USB 3.0', custo: 520, venda: 749, unidade: 'UN' },
    { nome: 'HD Externo Seagate Expansion 4TB USB 3.0', custo: 500, venda: 719, unidade: 'UN' },
    { nome: 'SSD Externo Samsung T7 Shield 2TB', custo: 950, venda: 1349, unidade: 'UN' },
    { nome: 'SSD Externo SanDisk Extreme Pro 2TB', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'HD Externo Toshiba Canvio Basics 2TB', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'SSD Externo Crucial X9 2TB USB 3.2', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'HD Externo WD My Passport Ultra 2TB', custo: 520, venda: 749, unidade: 'UN' },
    { nome: 'HD Externo Seagate One Touch 4TB', custo: 650, venda: 929, unidade: 'UN' },
    { nome: 'SSD Externo Kingston XS2000 2TB', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'HD Externo Samsung T5 1TB USB 3.1', custo: 450, venda: 649, unidade: 'UN' },
  ]},
  { cat: 'Smartwatches', items: [
    { nome: 'Smartwatch Samsung Galaxy Watch6 Classic 47mm BT', custo: 1600, venda: 2199, unidade: 'UN' },
    { nome: 'Smartwatch Apple Watch Ultra 2 49mm GPS', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Smartwatch Huawei Watch GT 4 Pro 46mm', custo: 1200, venda: 1699, unidade: 'UN' },
    { nome: 'Smartwatch Amazfit GTR Mini', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Smartwatch Xiaomi Watch S3 Active NFC', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Smartwatch Garmin Venu Sq 2', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Smartwatch Samsung Galaxy Watch FE 44mm', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Smartwatch Apple Watch SE 2 40mm GPS', custo: 1600, venda: 2199, unidade: 'UN' },
    { nome: 'Smartwatch Huawei Band 8 NFC', custo: 200, venda: 319, unidade: 'UN' },
    { nome: 'Smartwatch Amazfit Bip 5 Unity', custo: 320, venda: 459, unidade: 'UN' },
  ]},
  { cat: 'Servidores', items: [
    { nome: 'Servidor Dell PowerEdge T440 Xeon Silver 32GB', custo: 14000, venda: 18499, unidade: 'UN' },
    { nome: 'NAS QNAP TS-464 4-Bay NPU', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'NAS Synology DS423+ 4-Bay Intel', custo: 5500, venda: 7299, unidade: 'UN' },
    { nome: 'Servidor HP ProLiant ML110 G10 Xeon E-2388G', custo: 10000, venda: 13499, unidade: 'UN' },
    { nome: 'Rack 6U Padrão 19" Ventilado', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Rack 24U Fechado com Porta Vidro', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Servidor Lenovo ThinkSystem ST250 Xeon E-2300', custo: 9500, venda: 12499, unidade: 'UN' },
    { nome: 'No-Break APC Smart-UPS SRT5KXLI 5000VA', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Switch Gerenciável 48 Portas Gigabit', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'PDU 8 Tomadas Padrão 19" 20A', custo: 500, venda: 699, unidade: 'UN' },
  ]},
  { cat: 'Switches de Rede', items: [
    { nome: 'Switch TP-Link TL-SG1005P 5 Portas PoE Gigabit', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Switch D-Link DGS-1016A 16 Portas Gigabit', custo: 400, venda: 569, unidade: 'UN' },
    { nome: 'Switch Ubiquiti UniFi Switch 16 PoE 60W', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG2008P 8 Portas PoE 802.3at', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Switch HP 1810-24G V2 24 Portas J9805A', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'Switch Mikrotik CCR2004-16G-2S+EM', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'Switch Intelbras GSW-1204P 4 Portas PoE Gigabit', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Switch Ubiquiti UniFi Switch 48 PoE 750W', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG108 8 Portas Gigabit Metal', custo: 140, venda: 219, unidade: 'UN' },
    { nome: 'Switch D-Link DES-1026G 24+2 Portas Managed', custo: 800, venda: 1099, unidade: 'UN' },
  ]},
  { cat: 'Estabilizadores', items: [
    { nome: 'Estabilizador SMS 3000VA 2 tomadas', custo: 320, venda: 499, unidade: 'UN' },
    { nome: 'Estabilizador SMS Intelligent 1500VA bivolt', custo: 220, venda: 349, unidade: 'UN' },
    { nome: 'Estabilizador Força 1200VA 4 tomadas', custo: 160, venda: 249, unidade: 'UN' },
    { nome: 'Estabilizador Intelbras EST 2500 2500VA', custo: 350, venda: 529, unidade: 'UN' },
    { nome: 'Estabilizador SMS Eletrônico 2000VA bivolt', custo: 250, venda: 399, unidade: 'UN' },
  ]},
  { cat: 'Acessórios para Notebook', items: [
    { nome: 'Mochila Notebook Dell Pro 15.6" Premium', custo: 280, venda: 429, unidade: 'UN' },
    { nome: 'Cooler Notebook Targus AWE57USZ USB', custo: 80, venda: 139, unidade: 'UN' },
    { nome: 'Dock Station USB-C Dell D6000 Universal', custo: 850, venda: 1149, unidade: 'UN' },
    { nome: 'Base Notebook NBRG Inox Ajustável', custo: 80, venda: 139, unidade: 'UN' },
    { nome: 'Case Notebook 15.6" Neoprene Impermeável', custo: 35, venda: 64, unidade: 'UN' },
    { nome: 'Carregador Notebook Dell 65W Type-C', custo: 200, venda: 319, unidade: 'UN' },
    { nome: 'Suporte Monitor Notebook + Monitor Dual', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Teclado Notebook Bluetooth Dell KM7321W', custo: 200, venda: 319, unidade: 'UN' },
    { nome: 'Mouse Notebook Logitech M590 Silent Bluetooth', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Protetor Privacidade Notebook 14" Fosco', custo: 40, venda: 69, unidade: 'UN' },
  ]},
]

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

async function seed() {
  const cats = await db.categoria.findMany()
  const catMap = new Map(cats.map(c => [c.nome, c.id]))
  const existing = await db.produto.findMany({ select: { codigo: true } })
  const codeCounters: Record<string, number> = {}
  for (const p of existing) {
    const match = p.codigo.match(/^([A-Z]+)(\d+)$/)
    if (match) {
      if (!codeCounters[match[1]] || parseInt(match[2]) > codeCounters[match[1]])
        codeCounters[match[1]] = parseInt(match[2])
    }
  }
  const PM: Record<string, string> = {
    'Hubs USB': 'HUB', 'HDs Externos': 'HDE', 'Smartwatches': 'WTC',
    'Servidores': 'SRV', 'Switches de Rede': 'SWT', 'Estabilizadores': 'EST',
    'Acessórios para Notebook': 'ACN',
  }
  console.log('📦 Batch final...')
  let total = 0
  for (const group of FINAL) {
    const catId = catMap.get(group.cat)
    if (!catId) { console.log(`  ⚠ ${group.cat} not found`); continue }
    const prefix = PM[group.cat] || 'XXX'
    let counter = codeCounters[prefix] || 0
    for (const item of group.items) {
      counter++
      await db.produto.create({
        data: {
          codigo: `${prefix}${String(counter).padStart(3, '0')}`,
          nome: item.nome, descricao: null,
          precoCusto: item.custo, precoVenda: item.venda,
          estoqueAtual: randomInt(2, 150), estoqueMinimo: randomInt(3, 15),
          categoriaId: catId, codigoBarras: String(randomInt(1e12, 1e13 - 1)),
          unidade: item.unidade, status: 'ATIVO',
        }
      })
      total++
    }
    console.log(`  ✓ ${group.cat}: +${group.items.length}`)
  }
  console.log(`\n✅ +${total} produtos. Total: ${await db.produto.count()}`)
}

seed().catch(e => { console.error('❌', e); process.exit(1) }).finally(() => db.$disconnect())