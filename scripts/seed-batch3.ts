import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const BATCH3: { cat: string; items: { nome: string; custo: number; venda: number; unidade: string }[] }[] = [
  { cat: 'Placas-Mãe', items: [
    { nome: 'Placa-Mãe MSI PRO H610M-E DDR4 LGA1700', custo: 400, venda: 549, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte B660M AORUS Pro DDR4', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS Prime B650-PLUS DDR5 AM5', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Placa-Mãe ASRock B650M Pro RS WiFi DDR5', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI MAG B650 TOMAHAWK DDR5 WiFi', custo: 900, venda: 1199, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte B650 AORUS Elite AX DDR5', custo: 850, venda: 1149, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS ROG Strix Z790-E D5 WiFi LGA1700', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI MAG Z690 TOMAHAWK DDR5 WiFi', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte Z790 AORUS Master DDR5', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'Placa-Mãe ASRock B760M Steel Legend DDR5', custo: 680, venda: 929, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte X670E AORUS Elite AX AM5', custo: 1600, venda: 2099, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS TUF Gaming B650-PLUS D4 AM5', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI B760M BOMBER DDR4 LGA1700', custo: 450, venda: 619, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte H610M H DDR4 LGA1700', custo: 350, venda: 479, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS Prime Z690-P D4 DDR4 LGA1700', custo: 800, venda: 1099, unidade: 'UN' },
  ]},
  { cat: 'Fontes de Alimentação', items: [
    { nome: 'Fonte Corsair RM1000x 1000W 80+ Gold', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Fonte MSI MAG A750GL PCIE5 750W 80+ Gold', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Fonte XPG Pylon Pro 750W 80+ Bronze', custo: 320, venda: 449, unidade: 'UN' },
    { nome: 'Fonte EVGA SuperNOVA 750 G7 750W 80+ Gold', custo: 520, venda: 719, unidade: 'UN' },
    { nome: 'Fonte Thermaltake Toughpower GF A3 850W', custo: 500, venda: 689, unidade: 'UN' },
    { nome: 'Fonte Cooler Master MWE Gold V2 850W', custo: 600, venda: 829, unidade: 'UN' },
    { nome: 'Fonte FSP Hydro PTM 750W 80+ Platinum', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Fonte be quiet! Pure Power 12 M 750W', custo: 580, venda: 799, unidade: 'UN' },
    { nome: 'Fonte Corsair RM650e 650W 80+ Gold', custo: 480, venda: 669, unidade: 'UN' },
    { nome: 'Fonte Super Flower Leadex III 850W Gold', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Fonte Corsair HX1500i 1500W 80+ Platinum', custo: 1500, venda: 1999, unidade: 'UN' },
    { nome: 'Fonte Seasonic Focus GX-850 850W 80+ Gold', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Fonte NZXT C850L 850W 80+ Gold', custo: 600, venda: 829, unidade: 'UN' },
    { nome: 'Fonte Deepcool PK750D 750W 80+ Bronze', custo: 300, venda: 429, unidade: 'UN' },
    { nome: 'Fonte Cooler Master V850 SFX Gold 850W', custo: 900, venda: 1249, unidade: 'UN' },
  ]},
  { cat: 'Gabinetes', items: [
    { nome: 'Gabinete Corsair 5000D Airflow RGB', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Gabinete NZXT H7 Flow RGB Mid Tower', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Gabinete Lian Li O11 Dynamic EVO', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Gabinete Fractal Design Torrent RGB', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Gabinete Cooler Master HAF 700 EVO', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Gabinete be quiet! Pure Base 500DX', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Gabinete Montech AIR 903 MAX ARGB', custo: 350, venda: 489, unidade: 'UN' },
    { nome: 'Gabinete Thermaltake Core V21 Micro ATX', custo: 250, venda: 369, unidade: 'UN' },
    { nome: 'Gabinete Phanteks Eclipse G360A', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Gabinete ASUS ROG Strix Helios White', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Gabinete Lian Li Lancool III RGB', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Gabinete Cougar MX330-G Air RGB', custo: 220, venda: 339, unidade: 'UN' },
    { nome: 'Gabinete Corsair 4000D Airflow RGB', custo: 500, venda: 689, unidade: 'UN' },
    { nome: 'Gabinete NZXT H6 Flow Mid Tower', custo: 500, venda: 689, unidade: 'UN' },
    { nome: 'Gabinete Redragon Kaban Mid Tower', custo: 200, venda: 299, unidade: 'UN' },
  ]},
  { cat: 'Cabos e Conectores', items: [
    { nome: 'Cabo HDMI 2.1 Ultra High Speed 1m', custo: 20, venda: 39, unidade: 'UN' },
    { nome: 'Cabo HDMI 2.1 Ultra High Speed 5m', custo: 65, venda: 119, unidade: 'UN' },
    { nome: 'Cabo USB-C para HDMI 4K 60Hz 1.5m', custo: 40, venda: 79, unidade: 'UN' },
    { nome: 'Cabo Mini DisplayPort para DisplayPort 2m', custo: 25, venda: 49, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6a UTP 1m', custo: 8, venda: 15, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6a STP 5m', custo: 35, venda: 59, unidade: 'UN' },
    { nome: 'Cabo USB-C para USB-C 100W 1m Braided', custo: 30, venda: 54, unidade: 'UN' },
    { nome: 'Cabo Thunderbolt 4 40Gbps 0.8m', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Cabo DVI-D Dual Link 2m', custo: 20, venda: 39, unidade: 'UN' },
    { nome: 'Cabo S-Áudio 3.5mm estéreo 3m', custo: 8, venda: 15, unidade: 'UN' },
    { nome: 'Adaptador USB-C para VGA Multiport', custo: 50, venda: 89, unidade: 'UN' },
    { nome: 'Adaptador USB 3.0 para Gigabit Ethernet', custo: 45, venda: 79, unidade: 'UN' },
    { nome: 'Cabo de Alimentação 20A 1.8m', custo: 18, venda: 34, unidade: 'UN' },
    { nome: 'Cabo Coaxial 75 Ohms 10m', custo: 15, venda: 29, unidade: 'UN' },
    { nome: 'Extensor USB 3.0 Ativo 5m', custo: 40, venda: 69, unidade: 'UN' },
  ]},
  { cat: 'Smartphones', items: [
    { nome: 'Smartphone Motorola Moto G04 64GB', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Smartphone Motorola Moto G14 128GB', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A05s 64GB', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A34 5G 128GB', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Smartphone Xiaomi Redmi Note 13 Pro 5G 256GB', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Smartphone Xiaomi 13T 256GB', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S24 Ultra 512GB', custo: 7000, venda: 9299, unidade: 'UN' },
    { nome: 'Smartphone iPhone 15 Plus 128GB', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Smartphone iPhone 15 Pro Max 512GB', custo: 8000, venda: 10499, unidade: 'UN' },
    { nome: 'Smartphone OnePlus Nord CE4 128GB', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Smartphone Realme 12 Pro+ 256GB', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy Z Flip5 256GB', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Smartphone Google Pixel 8a 128GB', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'Smartphone Nothing Phone (2a) 128GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S23 FE 128GB', custo: 1800, venda: 2499, unidade: 'UN' },
  ]},
  { cat: 'Tablets', items: [
    { nome: 'Tablet Samsung Galaxy Tab S6 Lite 10.4" 128GB', custo: 1600, venda: 2199, unidade: 'UN' },
    { nome: 'Tablet Samsung Galaxy Tab S9 FE+ 12.4" 128GB', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Tablet iPad Air M2 13" 256GB Wi-Fi', custo: 6200, venda: 8299, unidade: 'UN' },
    { nome: 'Tablet Lenovo Tab P12 Pro 12.6" 256GB', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Tablet Xiaomi Pad 6 11" 128GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Tablet Huawei MatePad 11.5" S 128GB', custo: 1600, venda: 2199, unidade: 'UN' },
    { nome: 'Tablet Multilaser M11S 10.1" 64GB', custo: 400, venda: 599, unidade: 'UN' },
    { nome: 'Tablet Lenovo Yoga Tab 11 128GB', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'Tablet Acer One 10 T4-129L 64GB', custo: 650, venda: 949, unidade: 'UN' },
    { nome: 'Tablet Amazon Fire HD 10 32GB', custo: 600, venda: 849, unidade: 'UN' },
  ]},
  { cat: 'Coolers e Ventilação', items: [
    { nome: 'Cooler CPU Thermalright Peerless Assassin 120 SE ARGB', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Cooler CPU be quiet! Dark Rock 4', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Cooler AIO Corsair iCUE H100i ELITE Capellix XT', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Cooler AIO NZXT Kraken 360 RGB', custo: 950, venda: 1299, unidade: 'UN' },
    { nome: 'Fan 120mm ARGB Lian Li UNI FAN TL LCD', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Fan 140mm Arctic P14 PWM PST', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Cooler CPU Deepcool AK620 Digital', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Fan 120mm be quiet! Shadow Wings 2', custo: 70, venda: 109, unidade: 'UN' },
    { nome: 'Cooler CPU Cooler Master Hyper 620S', custo: 170, venda: 249, unidade: 'UN' },
    { nome: 'Pasta Térmica Thermalright Phantom Spirit 120 SE', custo: 50, venda: 79, unidade: 'UN' },
  ]},
  { cat: 'Caixas de Som', items: [
    { nome: 'Caixa de Som JBL Charge 5 Bluetooth Preto', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Caixa de Som Sony SRS-XE300 Bluetooth', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Caixa de Som JBL PartyBox 110 Bluetooth', custo: 1000, venda: 1349, unidade: 'UN' },
    { nome: 'Caixa de Som Edifier R1700BTs 2.0 Bluetooth', custo: 350, venda: 499, unidade: 'PÇ' },
    { nome: 'Caixa de Som Logitech Z207 2.0 Bluetooth', custo: 200, venda: 299, unidade: 'PÇ' },
    { nome: 'Caixa de Som Bose SoundLink Flex Bluetooth', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Caixa de Som Anker Soundcore Motion+', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Caixa de Som JBL Clip 4 Bluetooth', custo: 180, venda: 269, unidade: 'UN' },
    { nome: 'Caixa de Som Harman Kardon Onyx Studio 8', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'Caixa de Som Ultimate Ears BOOM 3 Bluetooth', custo: 500, venda: 699, unidade: 'UN' },
  ]},
  { cat: 'Pendrives', items: [
    { nome: 'Pendrive Samsung FIT Plus 256GB USB 3.1', custo: 100, venda: 169, unidade: 'UN' },
    { nome: 'Pendrive Kingston DataTraveler Max 128GB', custo: 80, venda: 129, unidade: 'UN' },
    { nome: 'Pendrive SanDisk Ultra Dual 64GB USB 3.0 OTG', custo: 50, venda: 89, unidade: 'UN' },
    { nome: 'Pendrive PNY Turbo 128GB USB 3.0', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Pendrive Kingston IronKey VP80 64GB Encrypted', custo: 250, venda: 399, unidade: 'UN' },
    { nome: 'Pendrive Corsair Flash Voyager GTX 128GB', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Pendrive SanDisk Extreme PRO 128GB USB 3.2', custo: 140, venda: 219, unidade: 'UN' },
    { nome: 'Pendrive Kingston DT Micro 3.0 64GB', custo: 45, venda: 79, unidade: 'UN' },
    { nome: 'Pendrive Samsung BAR Plus 256GB USB 3.1', custo: 110, venda: 179, unidade: 'UN' },
    { nome: 'Pendrive Xiaomi USB 3.1 128GB', custo: 55, venda: 89, unidade: 'UN' },
  ]},
  { cat: 'Microfones', items: [
    { nome: 'Microfone Fifine K669B Condensador USB', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Microfone HyperX QuadCast S RGB USB', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Microfone Rode NT-USB+ USB', custo: 650, venda: 949, unidade: 'UN' },
    { nome: 'Microfone Blue Yeti Nano USB', custo: 400, venda: 599, unidade: 'UN' },
    { nome: 'Microfone Fifine AmpliGame AM8 Pro XLR/USB', custo: 400, venda: 599, unidade: 'UN' },
    { nome: 'Microfone Audio-Technica AT2020USB+ Cardioid', custo: 850, venda: 1199, unidade: 'UN' },
    { nome: 'Microfone Elgato Wave:3 USB Preto', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Microfone Fifine A6V USB 4 Capsulas', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Microfone Samson Q9U Broadcast USB/XLR', custo: 500, venda: 719, unidade: 'UN' },
    { nome: 'Microfone Razer Seiren Mini Compact USB', custo: 180, venda: 279, unidade: 'UN' },
  ]},
  { cat: 'Webcams', items: [
    { nome: 'Webcam Logitech C270n HD 720p', custo: 110, venda: 179, unidade: 'UN' },
    { nome: 'Webcam Logitech C922x Pro Stream 1080p', custo: 400, venda: 569, unidade: 'UN' },
    { nome: 'Webcam Razer Kiyo Pro Ultra 4K 30fps', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'Webcam Elgato Facecam Pro 4K 60fps', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Webcam Microsoft LifeCam HD-5000', custo: 150, venda: 239, unidade: 'UN' },
  ]},
  { cat: 'Nobreaks e UPS', items: [
    { nome: 'Nobreak SMS Net Crown 2000VA Tower', custo: 620, venda: 849, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Face 1500VAI inteligente', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Nobreak APC Back-UPS Pro 650VA', custo: 500, venda: 689, unidade: 'UN' },
    { nome: 'Nobreak Intelbras NI 2000 2000VA', custo: 550, venda: 769, unidade: 'UN' },
    { nome: 'Nobreak Brastemp BNE50 500VA', custo: 350, venda: 499, unidade: 'UN' },
  ]},
  { cat: 'Projetores', items: [
    { nome: 'Projetor Epson EB-W52 1280x800 4000 lúmens', custo: 2600, venda: 3499, unidade: 'UN' },
    { nome: 'Projetor BenQ TH575 Full HD DLP 3500 lúmens', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Projetor Optoma HD146X Full HD 4400 lúmens', custo: 2600, venda: 3499, unidade: 'UN' },
    { nome: 'Projetor XGIMI Elfin Full HD 800 ANSI', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'Projetor LG CineBeam PF610P Full HD LED', custo: 2200, venda: 2999, unidade: 'UN' },
  ]},
  { cat: 'Licenças de Software', items: [
    { nome: 'Licença Norton 360 Deluxe 3 Dispositivos 1 Ano', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Licença ESET NOD32 Antivirus 1 Dispositivo 1 Ano', custo: 100, venda: 169, unidade: 'UN' },
    { nome: 'Licença Avast Premium Security Multidispositivo', custo: 130, venda: 219, unidade: 'UN' },
    { nome: 'Assinatura Canva Pro 1 Ano', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Licença TeamViewer Business 1 Ano', custo: 600, venda: 849, unidade: 'UN' },
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
      const prefix = match[1]
      const num = parseInt(match[2])
      if (!codeCounters[prefix] || num > codeCounters[prefix]) codeCounters[prefix] = num
    }
  }

  console.log('📦 Adicionando batch 3...')
  let total = 0
  for (const group of BATCH3) {
    const catId = catMap.get(group.cat)
    if (!catId) continue
    const PREFIX_MAP: Record<string, string> = {
      'Placas-Mãe': 'MB', 'Fontes de Alimentação': 'FON', 'Gabinetes': 'GAB',
      'Cabos e Conectores': 'CAB', 'Smartphones': 'CEL', 'Tablets': 'TAB',
      'Coolers e Ventilação': 'COL', 'Caixas de Som': 'SOM', 'Pendrives': 'PEN',
      'Microfones': 'MIC', 'Webcams': 'WBC', 'Nobreaks e UPS': 'NBR',
      'Projetores': 'PRJ', 'Licenças de Software': 'LIC',
    }
    const prefix = PREFIX_MAP[group.cat] || `X${String(total + 1).padStart(3, '0')}`
    let counter = codeCounters[prefix] || 0
    for (const item of group.items) {
      counter++
      const codigo = `${prefix}${String(counter).padStart(3, '0')}`
      await db.produto.create({
        data: {
          codigo, nome: item.nome, descricao: null,
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