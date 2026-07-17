import { db } from './src/lib/db'

const FIRST_NAMES = ['João','Maria','Pedro','Ana','Carlos','Fernanda','Lucas','Juliana','Rafael','Beatriz','Bruno','Camila','Gustavo','Daniela','Felipe','Isabella','Leonardo','Larissa','Marcos','Natália','André','Patrícia','Eduardo','Renata','Thiago','Vanessa','Victor','Amanda','Gabriel','Letícia','Ricardo','Mônica','Rodrigo','Priscila','Mateus','Cintia','Paulo','Sandra','Alexandre','Tatiana','Diego','Luciana','Roberto','Carla','Marcos','Flávia','Gustavo','Patrícia','Henrique','Aline','Fábio','Elaine','Caio','Renata','Vinícius','Mariana','Leandro','Rosângela','Eduardo','Cristina','Artur','Sônia','Igor','Solange','Rogério','Adriana','Wagner','Lúcia','Newton','Debora','Sérgio','Cátia','Evandro','Marina','Cláudio','Raquel','Benício','Verônica','Márcio','Cláudia','Edilson','Bernadete']
const LAST_NAMES = ['Silva','Santos','Oliveira','Souza','Lima','Pereira','Costa','Ferreira','Rodrigues','Almeida','Nascimento','Araújo','Melo','Barbosa','Ribeiro','Martins','Gomes','Carvalho','Rocha','Dias','Mendes','Nunes','Monteiro','Ramos','Moura','Cavalcanti','Vieira','Fonseca','Cardoso','Rangel','Teixeira','Moreira','Correia','Campos','Pinto','Araújo','Nogueira','Bezerra','Machado','Freitas']
const DOMAINS = ['gmail.com','hotmail.com','outlook.com','yahoo.com','uol.com.br','terra.com.br','ig.com.br','bol.com.br']
const CIDADES = [
  {cidade:'São Paulo',estado:'SP'},{cidade:'Rio de Janeiro',estado:'RJ'},{cidade:'Belo Horizonte',estado:'MG'},
  {cidade:'Salvador',estado:'BA'},{cidade:'Brasília',estado:'DF'},{cidade:'Curitiba',estado:'PR'},
  {cidade:'Recife',estado:'PE'},{cidade:'Porto Alegre',estado:'RS'},{cidade:'Fortaleza',estado:'CE'},
  {cidade:'Manaus',estado:'AM'},{cidade:'Goiânia',estado:'GO'},{cidade:'Belém',estado:'PA'},
  {cidade:'Campinas',estado:'SP'},{cidade:'Florianópolis',estado:'SC'},{cidade:'Natal',estado:'RN'},
  {cidade:'Maceió',estado:'AL'},{cidade:'Campo Grande',estado:'MS'},{cidade:'Vitória',estado:'ES'},
  {cidade:'São Luís',estado:'MA'},{cidade:'Teresina',estado:'PI'}
]
const RUAS = ['Rua Augusta','Avenida Paulista','Rua Oscar Freire','Rua Haddock Lobo','Avenida Faria Lima','Rua da Consolação','Avenida Brigadeiro','Rua Pamplona','Avenida Rebouças','Rua Bela Cintra','Rua Voluntários da Pátria','Avenida Angélica','Rua Maria Antônia','Avenida Ibirapuera','Rua Vergueiro','Avenida São João','Rua da Glória','Largo do Arouche','Praça da Sé','Rua 25 de Março']
const BAIRROS = ['Centro','Jardins','Vila Mariana','Pinheiros','Moema','Itaim Bibi','Consolação','Liberdade','Vila Madalena','Perdizes','Lapa','Santana','Tatuapé','Ipiranga','Penha','Mooca','São Miguel','Vila Carrão','Artur Alvim','Ponte Pequena']

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function genCPF(): string {
  const digits = Array.from({length:11}, () => randInt(0,9))
  if (digits.every(d => d === digits[0])) digits[0] = (digits[0] + 1) % 10
  return `${digits.slice(0,3).join('')}.${digits.slice(3,6).join('')}.${digits.slice(6,9).join('')}-${digits.slice(9).join('')}`
}
function genPhone(): string { return `(${randInt(11,99)}) ${randInt(2000,9999)}-${randInt(1000,9999)}` }
function genCel(): string { return `(${randInt(11,99)}) 9${randInt(1000,9999)}-${randInt(1000,9999)}` }
function genDate(minYear: number, maxYear: number): string {
  const y = randInt(minYear, maxYear), m = String(randInt(1,12)).padStart(2,'0'), d = String(randInt(1,28)).padStart(2,'0')
  return `${y}-${m}-${d}`
}

async function main() {
  console.log('=== SEED COMPLETO ERP ===')
  
  // Clean existing data
  console.log('Limpando dados existentes...')
  await db.movimentacaoEstoque.deleteMany()
  await db.itemVenda.deleteMany()
  await db.financeiro.deleteMany()
  await db.venda.deleteMany()
  await db.produto.deleteMany()
  await db.cliente.deleteMany()
  await db.categoria.deleteMany()

  // === CATEGORIAS ===
  console.log('Criando categorias...')
  const catNames = [
    'Smartphones & Celulares','Notebooks & Laptops','Desktops & All-in-Ones','Tablets & iPads','Monitores & Displays',
    'Componentes de PC','Periféricos','Armazenamento','Impressoras & Suprimentos','Redes & Conectividade',
    'Áudio & Som','Câmeras & Drones','Games & Consoles','Eletrônicos de Vestir','Carregadores & Energia',
    'Cabos & Adaptadores','Gabinetes & Coolers','Software & Licenças','Acessórios de Notebook','Projetores & Telas'
  ]
  const categorias = await db.categoria.createMany({
    data: catNames.map((nome, i) => ({ nome, descricao: `Categoria de ${nome.toLowerCase()}`, id: `cat-${String(i+1).padStart(4,'0')}` })),
  })
  const cats = await db.categoria.findMany({ orderBy: { nome: 'asc' } })
  console.log(`  ✓ ${cats.length} categorias criadas`)

  // === PRODUTOS (1000+) ===
  console.log('Criando produtos...')
  const brands = ['Samsung','Apple','Lenovo','Dell','HP','Asus','LG','Sony','Microsoft','Logitech','Razer','Corsair','HyperX','Kingston','Seagate','Western Digital','Intel','AMD','NVIDIA','Gigabyte','MSI','TP-Link','Netgear','JBL','Philips','Positivo','Acer','Motorola','Xiaomi','Huawei','Canon','Epson','Brother','Bose','Sennheiser','SteelSeries','Redragon','Cooler Master','NZXT','Nox','Zotac','EVGA','Crucial','Adata','SanDisk','Multilaser']
  
  const productTemplates = {
    'Smartphones & Celulares': [
      (b: string, i: number) => [`Galaxy S${24-i%3} Ultra ${256}GB`, `Galaxy A${55-i%5} ${128}GB`, `Galaxy M${34-i%3} ${64}GB`, `iPhone ${15-i%4} Pro Max`, `iPhone ${14-i%3} ${128}GB`, `Xiaomi ${14-i%2} Ultra`, `Xiaomi Redmi Note ${13-i%4}`, `Motorola Moto G${84-i%6}`, `Motorola Edge ${40-i%3} Pro`, `Huawei P${60-i%3} Pro`],
      [1200, 3200, 1600, 5500, 4200, 2800, 1400, 1100, 2600, 3800],
    ],
    'Notebooks & Laptops': [
      (b: string, i: number) => [`Notebook ${b} Inspiron ${15+i%5} ${i%2?'Touch':''}`, `MacBook Air M${2+i%3} ${256+i*128}GB`, `MacBook Pro ${14+i%2}" M${3+i%2} Pro`, `Notebook ${b} Legion ${5+i%3} ${i%2?'Pro':''}`, `Notebook ${b} VivoBook ${15+i%4}`, `Chromebook ${b} ${14+i%2}"`, `Notebook Gamer ${b} ROG Strix G${16+i%2}`, `Ultrabook ${b} ZenBook ${14+i%3}`],
      [3200, 7800, 9500, 5500, 2800, 2200, 6800, 4200],
    ],
    'Desktops & All-in-Ones': [
      (b: string, i: number) => [`Desktop ${b} ${i%2?'Gamer':'Office'} i${5+i%5}-${randInt(8,32)}GB`, `All-in-One ${b} ${24+i%2}" ${i%2?'Touch':''}`, `Desktop ${b} OptiPlex ${i%3+1}000`, `iMac ${24+i%2}" M${3+i%2}`, `PC Gamer ${b} RTX ${4060+i%4} i${7+i%3}`],
      [3500, 4500, 2800, 8500, 5200],
    ],
    'Tablets & iPads': [
      (b: string, i: number) => [`iPad Air M${2+i%2} ${256}GB`, `iPad Pro ${12+i%2}.9" M${4}`, `Galaxy Tab S${9-i%3} ${128}GB`, `Galaxy Tab A${9-i%2} ${64}GB`, `Xiaomi Pad ${6-i%2} Pro`],
      [4200, 6500, 3200, 1800, 2400],
    ],
    'Monitores & Displays': [
      (b: string, i: number) => [`Monitor ${b} ${24+i%4}" ${i%3?'IPS':'VA'} ${i%2?'165Hz':'75Hz'}`, `Monitor ${b} UltraWide ${34+i%2}"`, `Monitor Gamer ${b} ${27+i%3}" ${i%2?'QHD':'4K'} ${144+i*24}Hz`, `Monitor ${b} ${21+i%3}" Full HD`],
      [1200, 2800, 2200, 850],
    ],
    'Componentes de PC': [
      (b: string, i: number) => [`Processador ${b} Core i${5+i%5}-${randInt(12,45)}00`, `Processador AMD Ryzen ${5+i%5} ${3+i%5}00X`, `Placa de Vídeo ${b} RTX ${4060+i%6}`, `Placa de Vídeo AMD RX ${7600+i%4} XT`, `Memória RAM ${b} DDR${5-i%2} ${16+i*8}GB ${i%3?'3200MHz':'5600MHz'}`, `Placa Mãe ${b} ${i%2?'B760':'Z790'} LGA${1700+i%2}`, `Fonte ${b} ${550+i*50}W ${i%2?'80 Plus Bronze':'80 Plus Gold'}`, `SSD NVMe ${b} ${500+i*250}GB ${i%3?'Gen4':'Gen3'}`],
      [1200, 1400, 2800, 2200, 350, 650, 450, 280],
    ],
    'Periféricos': [
      (b: string, i: number) => [`Mouse ${b} ${i%2?'Wireless':'Gamer'} ${i%3?'RGB':''}`, `Teclado ${b} ${i%3?'Mecânico':'Membrana'} ${i%2?'Wireless':''}`, `Headset ${b} ${i%2?'7.1 Surround':'Stereo'} ${i%3?'RGB':''}`, `Webcam ${b} ${1080+i*180}p ${i%2?'Autofoco':''}`, `Mousepad ${b} ${i%2?'Gamer XL':'Padrão'} ${i%3?'RGB':''}`, `Controle ${b} ${i%2?'Xbox':'Bluetooth'}`],
      [180, 350, 450, 280, 120, 320],
    ],
    'Armazenamento': [
      (b: string, i: number) => [`SSD ${b} ${240+i*120}GB SATA`, `SSD NVMe ${b} ${500+i*500}GB`, `HD Externo ${b} ${1+i%3}TB ${i%2?'USB-C':'USB 3.0'}`, `Pen Drive ${b} ${32+i*32}GB ${i%2?'USB 3.0':'USB-C'}`, `Cartão MicroSD ${b} ${64+i*64}GB ${i%2?'A2':'A1'}`],
      [150, 280, 380, 45, 65],
    ],
    'Impressoras & Suprimentos': [
      (b: string, i: number) => [`Impressora ${b} ${i%3?'Multifuncional':'Jato de Tinta'} ${i%2?'Wi-Fi':''}`, `Impressora ${b} Laser ${i%2?'Mono':'Colorida'}`, `Impressora ${b} Térmica ${i%2?'58mm':'80mm'}`, `Cartucho ${b} ${i%2?'Preto':'Colorido'} ${i%3?'664':'652'}`, `Toner ${b} ${i%2?'Preto':'Ciano'} ${i%3?'MLT-':'TN-'}`],
      [650, 1200, 450, 120, 180],
    ],
    'Redes & Conectividade': [
      (b: string, i: number) => [`Roteador ${b} Wi-Fi ${6-i%2} ${i%2?'AX3000':'AX1800'}`, `Switch ${b} ${8+i*8} Portas ${i%3?'Gerenciável':'Não Gerenciável'}`, `Placa de Rede ${b} ${i%2?'PCIe':'USB'} Wi-Fi 6`, `Repetidor ${b} Wi-Fi ${i%2?'AC1200':'N300'}`, `Modem ${b} ${i%2?'Cable':'DSL'}`],
      [250, 350, 180, 150, 420],
    ],
    'Áudio & Som': [
      (b: string, i: number) => [`Caixa de Som ${b} ${i%2?'Bluetooth':'USB-C'} ${i%3?'20W':'10W'}`, `Fone de Ouvido ${b} ${i%2?'Over-Ear':'In-Ear'} ${i%3?'ANC':''}`, `Soundbar ${b} ${i%2?'5.1':'2.1'} ${i%3?'Bluetooth':''}`, `Microfone ${b} ${i%2?'Condensador':'USB'} ${i%3?'Cardioide':'Omnidirecional'}`],
      [350, 280, 550, 220],
    ],
    'Câmeras & Drones': [
      (b: string, i: number) => [`Câmera DSLR ${b} ${i%2?'Entry':'Mid'} ${i%3?'24MP':'48MP'}`, `Câmera Mirrorless ${b} ${i%2?'Full Frame':'APS-C'}`, `Drone ${b} ${i%2?'Mini':'Pro'} ${i%3?'4K':'8K'}`, `Action Cam ${b} ${i%2?'5':'4'}K ${i%3?'Waterproof':''}`],
      [3500, 5200, 2800, 1200],
    ],
    'Games & Consoles': [
      (b: string, i: number) => [`Console ${i%3===0?'PlayStation 5':i%3===1?'Xbox Series X':'Nintendo Switch'} ${i%2?'Digital':'Standard'}`, `Game ${b} ${['FIFA','GTA','Call of Duty','Minecraft','Zelda','Mario','God of War','Horizon'][i%8]} ${i%2?'Edição Especial':''}`, `Controle ${i%3===0?'DualSense':'Xbox'} ${i%2?'Custom':'Padrão'}`, `VR Headset Meta Quest ${3-i%3}`],
      [3200, 250, 380, 2200],
    ],
    'Eletrônicos de Vestir': [
      (b: string, i: number) => [`Smartwatch ${b} ${i%2?'Series '+8:'SE'} ${i%3?'GPS':''}`, `Óculos VR Meta Quest ${3-i%3}`, `Fone Bluetooth ${b} ${i%2?'TWS':'Neckband'} ${i%3?'ANC':''}`, `Tracker Fitness ${b} ${i%2?'Band':'Fit'} ${i%3?'Pro':''}`],
      [1200, 2500, 350, 250],
    ],
    'Carregadores & Energia': [
      (b: string, i: number) => [`Carregador ${b} ${20+i*10}W ${i%2?'USB-C':'USB-A'}`, `Power Bank ${b} ${10000+i*5000}mAh ${i%2?'Fast Charge':''}`, `Nobreak ${b} ${600+i*200}VA`, `Estabilizador ${b} ${300+i*100}VA`, `Carregador Veicular ${b} ${20+i*10}W`],
      [65, 120, 450, 280, 55],
    ],
    'Cabos & Adaptadores': [
      (b: string, i: number) => [`Cabo USB-C ${i%2?'1m':'2m'} ${i%3?'100W':'60W'}`, `Cabo HDMI ${i%3?'2.1':'2.0'} ${i%2?'1m':'2m'}`, `Adaptador USB-C ${i%2?'para HDMI':'Multiport'}`, `Hub USB-C ${4+i%4} Portas`, `Cabo DisplayPort ${i%2?'1m':'2m'}`],
      [25, 35, 85, 180, 45],
    ],
    'Gabinetes & Coolers': [
      (b: string, i: number) => [`Gabinete ${b} ${i%3?'Mid Tower':'Full Tower'} ${i%2?'RGB':'Padrão'} ${i%3?'Tempered Glass':''}`, `Cooler CPU ${b} ${i%2?'Tower':'Top Flow'} ${i%3?'RGB':''}`, `Fan ${b} ${120+i*40}mm ${i%2?'RGB':'Padrão'}`],
      [350, 180, 65],
    ],
    'Software & Licenças': [
      (b: string, i: number) => [`${b} Windows ${11-i%2} ${i%3?'Pro':'Home'} Licença`, `${b} Office ${365-i%3} ${i%2?'Anual':'Mensal'}`, `Antivírus ${b} ${i%2?'Premium':'Standard'} ${i%3?'1 PC':'3 PCs'}`],
      [550, 350, 180],
    ],
    'Acessórios de Notebook': [
      (b: string, i: number) => [`Mochila ${b} ${i%2?'14"':'15.6"'} ${i%3?'Executive':'Gamer'}`, `Suporte Notebook ${b} ${i%2?'Alumínio':'Ajustável'}`, `Protetor de Tela ${b} ${15+i%2}" ${i%3?'Matte':'Glossy'}`, `Base Gel ${b} ${i%2?'Dual':'Single'} Fan`],
      [180, 120, 45, 65],
    ],
    'Projetores & Telas': [
      (b: string, i: number) => [`Projetor ${b} ${i%2?'Full HD':'4K'} ${i%3?'3000':'5000'} Lúmens`, `Tela de Projeção ${b} ${80+i*20}" ${i%2?'Motorizada':'Fixa'}`, `Mini Projetor ${b} Portátil ${i%2?'Wi-Fi':''}`],
      [2800, 450, 1200],
    ],
  }

  let codeCounter = 1
  const allProducts: Array<{
    codigo: string; nome: string; descricao: string; precoCusto: number; precoVenda: number;
    estoqueAtual: number; estoqueMinimo: number; categoriaId: string; codigoBarras: string;
    unidade: string; status: string; id: string
  }> = []

  for (const cat of cats) {
    const tpl = productTemplates[cat.nome]
    if (!tpl) continue
    const [nameGen, prices] = tpl
    const nameCount = 50 + randInt(0, 20)
    for (let i = 0; i < nameCount; i++) {
      const brand = rand(brands)
      const names = nameGen(brand, i)
      const name = Array.isArray(names) ? rand(names) : names
      const basePrice = rand(prices)
      const variation = 0.8 + Math.random() * 0.4
      const precoVenda = Math.round(basePrice * variation * 100) / 100
      const precoCusto = Math.round(precoVenda * (0.3 + Math.random() * 0.3) * 100) / 100
      const estoqueAtual = randInt(0, 200)
      const estoqueMinimo = randInt(3, 20)
      const codigo = `TEC-${String(codeCounter).padStart(5, '0')}`
      codeCounter++
      
      allProducts.push({
        id: `prod-${codigo}`,
        codigo,
        nome: `${name} ${i < 3 ? brand : ''}`.trim(),
        descricao: `${name} - ${cat.nome}`,
        precoCusto, precoVenda, estoqueAtual, estoqueMinimo,
        categoriaId: cat.id,
        codigoBarras: `789${String(codeCounter).padStart(10, '0')}`,
        unidade: precoVenda < 50 ? 'CX' : 'UN',
        status: Math.random() > 0.97 ? 'INATIVO' : 'ATIVO',
      })
    }
  }

  // Batch insert products
  const BATCH = 50
  for (let i = 0; i < allProducts.length; i += BATCH) {
    const batch = allProducts.slice(i, i + BATCH)
    await db.produto.createMany({ data: batch })
    if ((i + BATCH) % 200 === 0 || i + BATCH >= allProducts.length) {
      process.stdout.write(`  Produtos: ${Math.min(i + BATCH, allProducts.length)}/${allProducts.length}\r`)
    }
  }
  console.log(`  ✓ ${allProducts.length} produtos criados`)

  // === CLIENTES (150) ===
  console.log('Criando clientes...')
  const clients: Array<{
    id: string; nome: string; cpf: string; email: string; telefone: string; celular: string;
    dataNascimento: string; cep: string; logradouro: string; numero: string; complemento: string;
    bairro: string; cidade: string; estado: string; status: string; limiteCredito: number
  }> = []

  const usedCPFs = new Set<string>()
  for (let i = 0; i < 150; i++) {
    let cpf = genCPF()
    while (usedCPFs.has(cpf)) cpf = genCPF()
    usedCPFs.add(cpf)
    const first = rand(FIRST_NAMES)
    const last = rand(LAST_NAMES)
    const nome = `${first} ${last}`
    const c = rand(CIDADES)
    clients.push({
      id: `cli-${String(i+1).padStart(5,'0')}`,
      nome, cpf,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${rand(DOMAINS)}`,
      telefone: genPhone(), celular: genCel(),
      dataNascimento: genDate(1960, 2005),
      cep: `${randInt(1,9)}${randInt(0,9)}${randInt(0,9)}${randInt(0,9)}${randInt(0,9)}-${randInt(0,9)}${randInt(0,9)}${randInt(0,9)}`,
      logradouro: rand(RUAS), numero: String(randInt(1, 9999)),
      complemento: Math.random() > 0.7 ? ['Apto 101','Sala 302','Casa','Fundos','Loja 5'][randInt(0,4)] : '',
      bairro: rand(BAIRROS), cidade: c.cidade, estado: c.estado,
      status: i < 130 ? 'ATIVO' : i < 145 ? 'INATIVO' : 'BLOQUEADO',
      limiteCredito: [500, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000][randInt(0,10)],
    })
  }

  for (let i = 0; i < clients.length; i += BATCH) {
    await db.cliente.createMany({ data: clients.slice(i, i + BATCH) })
  }
  console.log(`  ✓ ${clients.length} clientes criados`)

  // === VENDAS (500) ===
  console.log('Criando vendas, itens, movimentações e financeiro...')
  const produtos = await db.produto.findMany({ where: { status: 'ATIVO' } })
  const formasPag = ['Dinheiro','Cartão Crédito','Cartão Débito','PIX','Boleto'] as const
  const formasWeight = [0.12, 0.30, 0.15, 0.35, 0.08]
  
  function randForma(): string {
    const r = Math.random()
    let cum = 0
    for (let i = 0; i < formasPag.length; i++) {
      cum += formasWeight[i]
      if (r < cum) return formasPag[i]
    }
    return 'PIX'
  }

  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  let vendaNum = 0
  let totalVendas = 0
  let totalFinanceiro = 0
  let totalMovimentacoes = 0

  for (let i = 0; i < 500; i++) {
    const saleDate = new Date(ninetyDaysAgo.getTime() + Math.random() * (now.getTime() - ninetyDaysAgo.getTime()))
    const clienteId = Math.random() > 0.1 ? rand(clients).id : null
    const status = i < 480 ? 'CONCLUIDA' : i < 495 ? 'CANCELADA' : 'PENDENTE'
    
    const numItems = randInt(1, 5)
    const saleItems: Array<{ produtoId: string; quantidade: number; precoUnitario: number }> = []
    let subtotal = 0
    
    for (let j = 0; j < numItems; j++) {
      const prod = rand(produtos)
      const qty = randInt(1, 4)
      saleItems.push({ produtoId: prod.id, quantidade: qty, precoUnitario: prod.precoVenda })
      subtotal += prod.precoVenda * qty
    }

    const desconto = subtotal * (Math.random() > 0.7 ? Math.random() * 0.1 : 0)
    const total = Math.round((subtotal - desconto) * 100) / 100
    const dateStr = saleDate.toISOString().slice(0, 10)
    vendaNum++
    const numero = `VND-${dateStr.replace(/-/g, '')}-${String(vendaNum).padStart(4, '0')}`
    const formaPagamento = randForma()

    // Create sale with items in transaction-like fashion
    const venda = await db.venda.create({
      data: {
        id: `venda-${String(i+1).padStart(5,'0')}`,
        numero, clienteId, dataVenda: saleDate, subtotal, desconto, total, formaPagamento, status,
        itens: {
          create: saleItems.map((item, idx) => ({
            id: `item-${i}-${idx}`,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: Math.round(item.precoUnitario * item.quantidade * 100) / 100,
          }))
        }
      }
    })
    totalVendas++

    if (status === 'CONCLUIDA') {
      // Stock movements (SAIDA)
      for (const item of saleItems) {
        const prod = produtos.find(p => p.id === item.produtoId)
        if (prod) {
          const before = prod.estoqueAtual
          const after = Math.max(0, before - item.quantidade)
          await db.movimentacaoEstoque.create({
            data: {
              id: `mov-v-${i}-${item.produtoId.slice(-4)}`,
              produtoId: item.produtoId,
              tipo: 'SAIDA',
              quantidade: item.quantidade,
              estoqueAntes: before,
              estoqueDepois: after,
              motivo: `Venda ${numero}`,
            }
          })
          prod.estoqueAtual = after
          totalMovimentacoes++
        }
      }

      // Financial entry
      const diasVenc = randInt(0, 30)
      const vencDate = new Date(saleDate.getTime() + diasVenc * 24 * 60 * 60 * 1000)
      const isPaid = vencDate < now && Math.random() > 0.3
      const isOverdue = vencDate < now && !isPaid
      await db.financeiro.create({
        data: {
          id: `fin-${String(i+1).padStart(5,'0')}`,
          clienteId,
          tipo: 'RECEBER',
          descricao: `Venda ${numero}`,
          valor: total,
          dataVencimento: vencDate.toISOString().slice(0, 10),
          dataPagamento: isPaid ? new Date(saleDate.getTime() + randInt(0, 5) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : null,
          status: isPaid ? 'PAGO' : isOverdue ? 'ATRASADO' : 'PENDENTE',
          formaPagamento: isPaid ? formaPagamento : null,
        }
      })
      totalFinanceiro++
    }

    if ((i + 1) % 50 === 0) {
      process.stdout.write(`  Vendas: ${i + 1}/500 | Mov: ${totalMovimentacoes} | Fin: ${totalFinanceiro}\r`)
    }
  }
  console.log(`  ✓ ${totalVendas} vendas criadas`)
  console.log(`  ✓ ${totalMovimentacoes} movimentações de estoque`)
  console.log(`  ✓ ${totalFinanceiro} entradas financeiras`)

  // === ENTRADAS DE ESTOQUE (200) ===
  console.log('Criando entradas de estoque...')
  let entradas = 0
  for (let i = 0; i < 200; i++) {
    const prod = rand(produtos)
    const qty = randInt(5, 100)
    const date = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    await db.movimentacaoEstoque.create({
      data: {
        id: `mov-e-${String(i+1).padStart(4,'0')}`,
        produtoId: prod.id,
        tipo: 'ENTRADA',
        quantidade: qty,
        estoqueAntes: prod.estoqueAtual,
        estoqueDepois: prod.estoqueAtual + qty,
        motivo: 'Reposição de estoque',
        createdAt: date,
      }
    })
    prod.estoqueAtual += qty
    entradas++
    if ((i + 1) % 50 === 0) process.stdout.write(`  Entradas: ${i + 1}/200\r`)
  }
  console.log(`  ✓ ${entradas} entradas criadas`)

  // === CONTAS A PAGAR (50) ===
  console.log('Criando contas a pagar...')
  const fornecedores = ['Distribuidora TechMax','Imp. Mega Eletrônicos','Tech Supply Brasil','Comercial ByteStore','Global Parts Ltda']
  for (let i = 0; i < 50; i++) {
    const vencDate = new Date(now.getTime() + (Math.random() - 0.3) * 60 * 24 * 60 * 60 * 1000)
    const isOverdue = vencDate < now
    const isPaid = vencDate < now && Math.random() > 0.4
    await db.financeiro.create({
      data: {
        id: `fin-p-${String(i+1).padStart(4,'0')}`,
        tipo: 'PAGAR',
        descricao: `Compra fornecedor ${rand(fornecedores)}`,
        valor: Math.round((200 + Math.random() * 9800) * 100) / 100,
        dataVencimento: vencDate.toISOString().slice(0, 10),
        dataPagamento: isPaid ? vencDate.toISOString().slice(0, 10) : null,
        status: isPaid ? 'PAGO' : isOverdue ? 'ATRASADO' : 'PENDENTE',
        formaPagamento: isPaid ? 'Boleto' : null,
      }
    })
  }
  console.log('  ✓ 50 contas a pagar criadas')

  // Summary
  const pCount = await db.produto.count()
  const cCount = await db.cliente.count()
  const vCount = await db.venda.count()
  const fCount = await db.financeiro.count()
  const mCount = await db.movimentacaoEstoque.count()
  console.log('\n=== RESUMO DO SEED ===')
  console.log(`Categorias: ${cats.length}`)
  console.log(`Produtos:   ${pCount}`)
  console.log(`Clientes:   ${cCount}`)
  console.log(`Vendas:     ${vCount}`)
  console.log(`Financeiro: ${fCount}`)
  console.log(`Mov. Estoque: ${mCount}`)
  console.log('=== CONCLUÍDO ===')
}

main().catch((e) => { console.error(e); process.exit(1) })