import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const MORE: { cat: string; items: { nome: string; custo: number; venda: number; unidade: string }[] }[] = [
  { cat: 'Desktops', items: [
    { nome: 'Desktop Dell OptiPlex 3000 Micro i3-12100T 8GB', custo: 2400, venda: 3199, unidade: 'UN' },
    { nome: 'Desktop HP ProDesk 400 G7 i5-10500 8GB 512GB', custo: 2800, venda: 3699, unidade: 'UN' },
    { nome: 'Desktop Lenovo IdeaCentre 5 i5-12400 16GB 512GB', custo: 3200, venda: 4199, unidade: 'UN' },
    { nome: 'Desktop PC Gamer Pichau Viper i7-12700F RTX 4060', custo: 5500, venda: 7199, unidade: 'UN' },
    { nome: 'Desktop Acer Aspire XC-1760 i5-12400 8GB 1TB', custo: 2600, venda: 3399, unidade: 'UN' },
    { nome: 'Mac Studio M2 Max 32GB 1TB SSD', custo: 18000, venda: 23499, unidade: 'UN' },
    { nome: 'Desktop Dell Precision 3650 i9-12900K 64GB 2TB RTX A4000', custo: 18000, venda: 23499, unidade: 'UN' },
    { nome: 'Desktop Lenovo ThinkCentre M70q Tiny i5-12500T 8GB', custo: 2900, venda: 3799, unidade: 'UN' },
    { nome: 'Desktop PC Gamer Corsair One i7-14700K RTX 4070 Super', custo: 12000, venda: 15499, unidade: 'UN' },
    { nome: 'Desktop HP Z2 Tower G9 i7-13700 32GB 1TB RTX A2000', custo: 10000, venda: 12999, unidade: 'UN' },
    { nome: 'Desktop Dell Vostro 3720 i7-12700 16GB 1TB SSD', custo: 3600, venda: 4699, unidade: 'UN' },
    { nome: 'Desktop ASUS ROG Strix G35 i7-13700KF RTX 4080 32GB', custo: 14000, venda: 17999, unidade: 'UN' },
  ]},
  { cat: 'Monitores', items: [
    { nome: 'Monitor LG 27MP400-B 27" IPS Full HD 75Hz', custo: 620, venda: 849, unidade: 'UN' },
    { nome: 'Monitor Dell E2423H 23.8" IPS Full HD 60Hz', custo: 600, venda: 829, unidade: 'UN' },
    { nome: 'Monitor HP V24i FHD 23.8" IPS 100Hz', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey G7 S28AG702NC 28" 4K 144Hz', custo: 3800, venda: 4999, unidade: 'UN' },
    { nome: 'Monitor Acer Nitro XV272U Vbmiiprx 27" QHD 180Hz', custo: 1700, venda: 2299, unidade: 'UN' },
    { nome: 'Monitor BenQ MOBIUZ EX2710U 27" 4K IPS 60Hz', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Monitor Philips 272E2FAES 27" QHD IPS 75Hz', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Monitor AOC Q27B3MA 27" QHD 100Hz IPS', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Monitor LG 32GK650F-B 32" QHD 144Hz VA', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Monitor ASUS ProArt PA279CRV 27" 4K USB-C', custo: 3500, venda: 4599, unidade: 'UN' },
    { nome: 'Monitor Gigabyte M28U 28" 4K 144Hz IPS', custo: 2500, venda: 3299, unidade: 'UN' },
    { nome: 'Monitor Samsung S24R350FHN 24" Full HD 75Hz', custo: 550, venda: 769, unidade: 'UN' },
  ]},
  { cat: 'Notebooks', items: [
    { nome: 'Notebook Positivo Twist S542 Intel Celeron 4GB 128GB', custo: 1100, venda: 1699, unidade: 'UN' },
    { nome: 'Notebook Multilaser NB315 15.6" Intel i3 4GB 256GB', custo: 1500, venda: 2199, unidade: 'UN' },
    { nome: 'Notebook CCE WNM545 i5-1035G1 8GB 256GB SSD', custo: 2000, venda: 2799, unidade: 'UN' },
    { nome: 'Notebook Dell G16 7630 i7-13700H RTX 4060 16GB', custo: 6800, venda: 8799, unidade: 'UN' },
    { nome: 'Notebook Lenovo Legion Pro 7i Gen 8 i9-13900HX RTX 4080', custo: 14000, venda: 17999, unidade: 'UN' },
    { nome: 'Notebook MacBook Pro 16 M3 Max 36GB 1TB', custo: 20000, venda: 26499, unidade: 'UN' },
    { nome: 'Notebook HP Omen 16 16-b1010nt RTX 4070 16GB', custo: 7000, venda: 9199, unidade: 'UN' },
    { nome: 'Notebook Acer Predator Helios 18 RTX 4080 i9', custo: 12000, venda: 15499, unidade: 'UN' },
    { nome: 'Notebook Razer Blade 16 2024 RTX 4070 i7-13650HX', custo: 11000, venda: 14499, unidade: 'UN' },
    { nome: 'Notebook Asus ROG Zephyrus G16 2024 RTX 4060', custo: 7500, venda: 9699, unidade: 'UN' },
    { nome: 'Notebook Microsoft Surface Laptop 6 i5 16GB 256GB', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Notebook Dell XPS 15 9530 i9-13900H RTX 4060 32GB', custo: 11000, venda: 14499, unidade: 'UN' },
    { nome: 'Notebook Samsung Galaxy Book4 Pro 360 i7 16GB', custo: 6800, venda: 8799, unidade: 'UN' },
    { nome: 'Notebook Lenovo ThinkPad X1 Carbon Gen 11 i7-1365U', custo: 9000, venda: 11999, unidade: 'UN' },
    { nome: 'Notebook HP ZBook Studio G10 i9-13900H RTX A2000', custo: 15000, venda: 19499, unidade: 'UN' },
  ]},
  { cat: 'Smartphones', items: [
    { nome: 'Smartphone Xiaomi Redmi 14C 128GB', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A16 128GB', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Smartphone Motorola Moto G85 5G 256GB', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Smartphone POCO X6 Pro 256GB', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'Smartphone iPhone 16 128GB', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Smartphone iPhone 16 Pro 256GB', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S24 FE 256GB', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy Z Fold6 512GB', custo: 10000, venda: 12999, unidade: 'UN' },
    { nome: 'Smartphone Google Pixel 9 Pro 256GB', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'Smartphone Xiaomi 14 Ultra 512GB', custo: 4000, venda: 5299, unidade: 'UN' },
    { nome: 'Smartphone Sony Xperia 1 VI 256GB', custo: 4000, venda: 5299, unidade: 'UN' },
    { nome: 'Smartphone ASUS Zenfone 11 Ultra 512GB', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'Smartphone Realme GT 6 256GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Smartphone TCL 40 XL 128GB', custo: 500, venda: 749, unidade: 'UN' },
    { nome: 'Smartphone Nokia G42 5G 128GB', custo: 600, venda: 849, unidade: 'UN' },
  ]},
  { cat: 'Vendas', items: [
    { nome: 'Leitor de Código de Barras Zebra DS2208 USB', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Leitor de Código de Barras Honeywell Genesis 7580g', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Impressora Térmica 80mm Epson TM-T20X', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Gaveta de Dinheiro 5 Compartimentos USB', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Balança Digital de Precço 15kg ETI', custo: 400, venda: 569, unidade: 'UN' },
    { nome: 'Display de Preço Eletrônico ESL 2.13" E-ink', custo: 120, venda: 199, unidade: 'UN' },
    { nome: 'Verificador de Preços Datalogic Gryphon GFS4500', custo: 1800, venda: 2449, unidade: 'UN' },
    { nome: 'Leitor QR Code 2D Sunmi V2 Pro', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Impressora Térmica Positivo PP-8800i MFi', custo: 400, venda: 569, unidade: 'UN' },
    { nome: 'Terminal de Pagamento POS Gertec PPC920', custo: 350, venda: 499, unidade: 'UN' },
  ]},
]

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

async function seed() {
  const cats = await db.categoria.findMany()
  const catMap = new Map(cats.map(c => [c.nome, c.id]))

  // Create "PDV e Automação" category for POS items
  if (!catMap.has('PDV e Automação')) {
    const c = await db.categoria.create({ data: { nome: 'PDV e Automação', descricao: 'Leitores, impressoras e periféricos para PDV' } })
    catMap.set('PDV e Automação', c.id)
    console.log('  ✓ Nova categoria: PDV e Automação')
  }

  const existing = await db.produto.findMany({ select: { codigo: true } })
  const codeCounters: Record<string, number> = {}
  for (const p of existing) {
    const m = p.codigo.match(/^([A-Z]+)(\d+)$/)
    if (m) { if (!codeCounters[m[1]] || parseInt(m[2]) > codeCounters[m[1]]) codeCounters[m[1]] = parseInt(m[2]) }
  }
  const PM: Record<string, string> = {
    'Desktops': 'DT', 'Monitores': 'MNT', 'Notebooks': 'NB',
    'Smartphones': 'CEL', 'PDV e Automação': 'PDV',
  }

  console.log('📦 Último batch...')
  let total = 0
  for (const group of MORE) {
    const catId = catMap.get(group.cat)
    if (!catId) { console.log(`  ⚠ ${group.cat}`); continue }
    const prefix = PM[group.cat] || 'XXX'
    let counter = codeCounters[prefix] || 0
    for (const item of group.items) {
      counter++
      await db.produto.create({
        data: {
          codigo: `${prefix}${String(counter).padStart(3, '0')}`,
          nome: item.nome, descricao: null,
          precoCusto: item.custo, precoVenda: item.venda,
          estoqueAtual: randomInt(3, 120), estoqueMinimo: randomInt(3, 15),
          categoriaId: catId, codigoBarras: String(randomInt(1e12, 1e13 - 1)),
          unidade: item.unidade, status: 'ATIVO',
        }
      })
      total++
    }
    console.log(`  ✓ ${group.cat}: +${group.items.length}`)
  }
  console.log(`\n✅ +${total} produtos. Total: ${await db.produto.count()}`)
  console.log(`   📂 Categorias: ${await db.categoria.count()}`)
  console.log(`   👥 Clientes: ${await db.cliente.count()}`)
  console.log(`   🛒 Vendas: ${await db.venda.count()}`)
}

seed().catch(e => { console.error('❌', e); process.exit(1) }).finally(() => db.$disconnect())