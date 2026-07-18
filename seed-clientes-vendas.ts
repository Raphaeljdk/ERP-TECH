import { db } from './src/lib/db'
import { randomUUID } from 'crypto'

// ==================== HELPERS ====================

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weightedPick(items: { value: string; weight: number }[]): string {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item.value
  }
  return items[items.length - 1].value
}

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(rand(8, 18), rand(0, 59), rand(0, 59), 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

function formatDateTime(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function generateCPF(): string {
  const digits: number[] = []
  for (let i = 0; i < 9; i++) digits.push(rand(0, 9))
  if (digits.every(d => d === digits[0])) {
    digits[rand(0, 8)] = (digits[0] + 1) % 10
  }
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i)
  let rem = (sum * 10) % 11
  digits.push(rem === 10 ? 0 : rem)
  sum = 0
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i)
  rem = (sum * 10) % 11
  digits.push(rem === 10 ? 0 : rem)
  return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${digits[9]}${digits[10]}`
}

function generatePhone(): string {
  return `(${rand(11, 99)}) ${rand(2000, 9999)}-${rand(1000, 9999)}`
}

function generateCelular(): string {
  return `(${rand(11, 99)}) 9${rand(1000, 9999)}-${rand(1000, 9999)}`
}

// ==================== DATA POOLS ====================

const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Lucas', 'Juliana', 'Rafael', 'Beatriz',
  'Bruno', 'Camila', 'Gustavo', 'Daniela', 'Felipe', 'Isabella', 'Leonardo', 'Larissa', 'Marcos', 'Natália',
  'André', 'Patrícia', 'Eduardo', 'Renata', 'Thiago', 'Vanessa', 'Victor', 'Amanda', 'Gabriel', 'Letícia',
  'Ricardo', 'Mônica', 'Rodrigo', 'Priscila', 'Mateus', 'Cintia', 'Paulo', 'Sandra', 'Alexandre', 'Tatiana',
  'Diego', 'Luciana', 'Roberto', 'Aline', 'Marcos', 'Carla', 'Luiz', 'Fernanda', 'Robson', 'Patrícia',
  'Vinícius', 'Bianca', 'Gustavo', 'Márcia', 'Eduardo', 'Solange', 'Leandro', 'Tânia', 'Flávio', 'Rosa',
  'Evandro', 'Nádia', 'Cláudio', 'Elaine', 'Sérgio', 'Claudia', 'Wagner', 'Adriana', 'Jorge', 'Cristina',
  'Mauro', 'Débora', 'Nelson', 'Rosângela', 'César', 'Lúcia', 'Artur', 'Betânia', 'Hugo', 'Miriam'
]

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
  'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Ribeiro', 'Martins', 'Gomes', 'Carvalho', 'Rocha', 'Dias',
  'Mendes', 'Nunes', 'Monteiro', 'Ramos', 'Bispo', 'Moura', 'Cavalcanti', 'Freitas', 'Vieira', 'Fonseca',
  'Cardoso', 'Rangel', 'Teixeira', 'Moreira', 'Correia', 'Pinto', 'Campos', 'Vasconcelos', 'Nogueira', 'Lopes'
]

const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'uol.com.br', 'terra.com.br']

const cidades: { cidade: string; estado: string; ceps: string[]; bairros: string[] }[] = [
  { cidade: 'São Paulo', estado: 'SP', ceps: ['01001-000','01310-100','01420-000','04538-133','05001-000','02402-001','03053-000','04789-000','05425-001','08420-000'], bairros: ['Consolação','Bela Vista','Liberdade','Vila Mariana','Pinheiros','Moema','Itaim Bibi','Perdizes','Santana','Tatuapé'] },
  { cidade: 'Rio de Janeiro', estado: 'RJ', ceps: ['20040-020','20271-020','22041-060','24020-001','22290-080','21040-010','23050-200','21351-070','22710-000','20550-001'], bairros: ['Copacabana','Ipanema','Leblon','Botafogo','Flamengo','Tijuca','Barra da Tijuca','Centro','Lapa','Santa Teresa'] },
  { cidade: 'Belo Horizonte', estado: 'MG', ceps: ['30130-000','30310-110','30240-060','30140-000','30320-020','30421-160','30510-000','30150-000','30830-000','30710-000'], bairros: ['Savassi','Funcionários','Lourdes','Sion','Buritis','Pampulha','Contagem','Barro Preto','Centro','Santa Efigênia'] },
  { cidade: 'Salvador', estado: 'BA', ceps: ['40020-010','40210-340','41820-020','40285-000','40301-110','41750-000','40280-000','41650-000','40060-000','40350-000'], bairros: ['Pelourinho','Barra','Itaigara','Pituba','Rio Vermelho','Campeche','Stella Maris','Centro','Graça','Nazaré'] },
  { cidade: 'Brasília', estado: 'DF', ceps: ['70000-000','71000-000','72000-000','70300-000','70600-000','71500-000','70800-000','70200-000','72300-000','73000-000'], bairros: ['Asa Sul','Asa Norte','Lago Sul','Lago Norte','Sudoeste','Noroeste','Park Way','SQN','SHS','SHIS'] },
  { cidade: 'Curitiba', estado: 'PR', ceps: ['80010-000','80210-000','80520-000','82800-000','80730-000','82510-000','80420-000','82200-000','80620-000','81530-000'], bairros: ['Centro','Batel','Ecoville','Alto da XV','Mercês','Água Verde','Juvevê','Bigorrilho','Santa Felicidade','Portão'] },
  { cidade: 'Recife', estado: 'PE', ceps: ['50010-000','52010-000','53020-000','51020-000','54710-000','53410-000','51150-000','50730-000','52110-000','54420-000'], bairros: ['Boa Viagem','Recife Antigo','Santos','Madalena','Espinheiro','Derby','Casa Forte','Parnamirim','Torre','Graças'] },
  { cidade: 'Porto Alegre', estado: 'RS', ceps: ['90010-000','90440-000','90520-000','91000-000','90620-000','91410-000','90820-000','91350-000','90230-000','91750-000'], bairros: ['Centro Histórico','Moinhos de Vento','Petrópolis','Menino Deus','Cidade Baixa','Bela Vista','Partenon','Jardim Botânico','Tristeza','Cascata'] },
  { cidade: 'Fortaleza', estado: 'CE', ceps: ['60010-000','60110-000','60810-000','60530-000','60150-000','60710-000','60310-000','60410-000','60220-000','60920-000'], bairros: ['Meireles','Aldeota','Mucuripe','Beira Mar','Centro','Benfica','Dionísio Torres','Joquei Clube','Praia de Iracema','Cocó'] },
  { cidade: 'Goiânia', estado: 'GO', ceps: ['74010-000','74120-000','74230-000','74310-000','74430-000','74520-000','74600-000','74710-000','74820-000','74930-000'], bairros: ['Setor Marista','Setor Bueno','Setor Oeste','Jardim Goiás','Setor Sul','Setor Norte','Park Lozandes','Alto da Glória','Setor Aeroporto','Nova Vila'] }
]

const logradouros = ['Rua','Avenida','Rua','Rua','Avenida','Rua','Travessa','Rua','Avenida','Rua','Rua','Rua','Avenida','Rua','Rua','Travessa','Rua','Avenida','Rua','Rua']

const logradouroNames = [
  'das Flores','Augusta','Paulista','Rio Branco','Amazonas','da Consolação','Oscar Freire',
  'Haddock Lobo','Pamplona','Joaquim Floriano','Bel a Cintra','Frei Caneca','da Assembleia',
  'Treze de Maio','Sete de Setembro','Quinze de Novembro','Dom Pedro II','Tiradentes',
  'da Independência','Voluntários da Pátria','das Palmeiras','do Comércio','da Graça',
  'São Jorge','do Rosário','Nossa Senhora das Graças','da Paz','da Esperança',
  'do Progresso','Brasil','Caruaru','Cariri','Professor João','Doutor Arnaldo',
  'Engenheiro Luís','General Osório','Marechal Deodoro','Barão de Mauá',
  'Conde de Porto Alegre','Visconde de Pirajá','Barata Ribeiro','Dias Ferreira',
  'Siqueira Campos','Miguel Couto','Barão de Mesquita','Alice Fiuza',
  'da Pedreira','do Catalão','das Graças','São Pedro','Santa Catarina',
  'São Francisco','São José','da Penha','das Dores','do Amparo'
]

// ==================== MAIN ====================

async function main() {
  console.log('========================================')
  console.log('  SEED: Clients, Sales, Stock, Finance  ')
  console.log('========================================\n')

  // ---- Step 1: Wait for products ----
  console.log('[1/5] Verificando se produtos existem...')
  let productCount = 0
  for (let attempt = 1; attempt <= 10; attempt++) {
    productCount = await db.produto.count()
    if (productCount > 0) {
      console.log(`  ✓ ${productCount} produtos encontrados`)
      break
    }
    console.log(`  ⏳ Tentativa ${attempt}/10 - Aguardando produtos...`)
    await new Promise(r => setTimeout(r, 5000))
  }
  if (productCount === 0) {
    console.error('  ✗ Nenhum produto encontrado. Abortando.')
    process.exit(1)
  }

  // ---- Step 2: Create 150 Clients ----
  console.log('\n[2/5] Criando 150 clientes...')
  const statusPool: string[] = []
  for (let i = 0; i < 130; i++) statusPool.push('ATIVO')
  for (let i = 0; i < 15; i++) statusPool.push('INATIVO')
  for (let i = 0; i < 5; i++) statusPool.push('BLOQUEADO')
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]]
  }

  const usedCPFs = new Set<string>()
  const clientData: any[] = []
  for (let i = 0; i < 150; i++) {
    let cpf: string
    do { cpf = generateCPF() } while (usedCPFs.has(cpf))
    usedCPFs.add(cpf)
    const fn = pick(firstNames), ln = pick(lastNames)
    const cityData = pick(cidades)
    clientData.push({
      nome: `${fn} ${ln}`,
      cpf,
      email: `${fn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}.${ln.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}@${pick(domains)}`,
      telefone: generatePhone(),
      celular: generateCelular(),
      dataNascimento: `${String(rand(1,28)).padStart(2,'0')}/${String(rand(1,12)).padStart(2,'0')}/${rand(1960,2005)}`,
      cep: pick(cityData.ceps),
      logradouro: `${pick(logradouros)} ${pick(logradouroNames)}`,
      numero: String(rand(1, 9999)),
      bairro: pick(cityData.bairros),
      cidade: cityData.cidade,
      estado: cityData.estado,
      status: statusPool[i],
      limiteCredito: rand(500, 50000)
    })
  }

  // Batch insert clients
  for (let i = 0; i < clientData.length; i += 50) {
    const batch = clientData.slice(i, i + 50)
    const r = await db.cliente.createMany({ data: batch })
    console.log(`  ✓ ${r.count} clientes (lote ${Math.floor(i/50)+1}/3)`)
  }

  const allClients = await db.cliente.findMany({ select: { id: true, status: true } })
  const activeClients = allClients.filter(c => c.status === 'ATIVO')
  console.log(`  ✓ Total: ${allClients.length} clientes (${activeClients.length} ativos)`)

  // ---- Step 3: Generate all sales data in memory, then batch insert ----
  console.log('\n[3/5] Gerando 500 vendas com itens, mov. estoque e financeiro...')

  const allProducts = await db.produto.findMany({ select: { id: true, nome: true, precoVenda: true, estoqueAtual: true } })
  console.log(`  ✓ ${allProducts.length} produtos disponíveis`)

  const paymentW = [
    { value: 'PIX', weight: 35 }, { value: 'Cartão Crédito', weight: 30 },
    { value: 'Cartão Débito', weight: 15 }, { value: 'Dinheiro', weight: 12 }, { value: 'Boleto', weight: 8 }
  ]
  const saleW = [
    { value: 'CONCLUIDA', weight: 480 }, { value: 'CANCELADA', weight: 15 }, { value: 'PENDENTE', weight: 5 }
  ]

  const today = new Date()
  const saleNumbersByDay = new Map<string, number>()

  // Fetch existing venda numbers to avoid collisions
  const existingVendas = await db.venda.findMany({ select: { numero: true } })
  for (const v of existingVendas) {
    const match = v.numero.match(/^VND-(\d{8})-(\d{4})$/)
    if (match) {
      const dk = match[1]
      const seq = parseInt(match[2], 10)
      const cur = saleNumbersByDay.get(dk) || 0
      if (seq >= cur) saleNumbersByDay.set(dk, seq)
    }
  }
  console.log(`  ✓ ${existingVendas.length} vendas existentes encontradas, sequências carregadas`)

  // Pre-generate all data
  const vendaRecords: any[] = []
  const itemRecords: any[] = []
  const movSaidaRecords: any[] = []
  const finRecords: any[] = []

  for (let i = 0; i < 500; i++) {
    const saleDate = daysAgo(rand(0, 90))
    const isCF = Math.random() < 0.10
    const clienteId = isCF ? null : pick(activeClients).id
    const formaPagamento = weightedPick(paymentW)
    const status = weightedPick(saleW)

    const dateKey = `${saleDate.getFullYear()}${String(saleDate.getMonth()+1).padStart(2,'0')}${String(saleDate.getDate()).padStart(2,'0')}`
    const seq = (saleNumbersByDay.get(dateKey) || 0) + 1
    saleNumbersByDay.set(dateKey, seq)
    const numero = `VND-${dateKey}-${String(seq).padStart(4, '0')}`

    const vendaId = randomUUID()
    const numItems = rand(2, 6)
    let calcSubtotal = 0

    for (let j = 0; j < numItems; j++) {
      const prod = pick(allProducts)
      const qtd = rand(1, 5)
      const preco = prod.precoVenda
      const sub = parseFloat((qtd * preco).toFixed(2))
      calcSubtotal = parseFloat((calcSubtotal + sub).toFixed(2))
      itemRecords.push({
        id: randomUUID(),
        vendaId,
        produtoId: prod.id,
        quantidade: qtd,
        precoUnitario: preco,
        subtotal: sub
      })

      if (status === 'CONCLUIDA') {
        movSaidaRecords.push({
          id: randomUUID(),
          produtoId: prod.id,
          tipo: 'SAIDA',
          quantidade: qtd,
          estoqueAntes: 0,
          estoqueDepois: 0,
          motivo: `Venda ${numero}`
        })
      }
    }

    const descPct = status === 'CANCELADA' ? 0 : randFloat(0, 10)
    const desconto = parseFloat((calcSubtotal * descPct / 100).toFixed(2))
    const total = parseFloat((calcSubtotal - desconto).toFixed(2))

    vendaRecords.push({
      id: vendaId,
      numero,
      clienteId,
      dataVenda: saleDate,
      subtotal: calcSubtotal,
      desconto,
      total,
      formaPagamento,
      status,
      observacoes: isCF ? 'Consumidor Final' : null
    })

    if (status === 'CONCLUIDA') {
      const vencDays = rand(0, 30)
      const dataVenc = addDays(saleDate, vencDays)
      const isPast = dataVenc < today
      let finStatus: string, dataPag: string | null = null

      if (formaPagamento === 'PIX' || formaPagamento === 'Dinheiro' || formaPagamento === 'Cartão Débito') {
        finStatus = 'PAGO'
        dataPag = formatDateTime(saleDate)
      } else if (isPast) {
        const r = Math.random() * 100
        if (r < 70) { finStatus = 'PAGO'; dataPag = formatDate(addDays(saleDate, rand(0, Math.min(vencDays, 5)))) }
        else if (r < 90) { finStatus = 'PENDENTE' }
        else { finStatus = 'ATRASADO' }
      } else {
        const r = Math.random() * 100
        if (r < 50 && formaPagamento !== 'Boleto') { finStatus = 'PAGO'; dataPag = formatDate(saleDate) }
        else { finStatus = 'PENDENTE' }
      }

      finRecords.push({
        id: randomUUID(),
        clienteId,
        tipo: 'RECEBER',
        descricao: `Venda ${numero}`,
        valor: total,
        dataVencimento: formatDate(dataVenc),
        dataPagamento: dataPag,
        status: finStatus,
        formaPagamento,
        vendaId
      })
    }

    if ((i + 1) % 100 === 0) console.log(`  ✓ ${i+1}/500 vendas geradas na memória`)
  }

  // Batch insert vendas
  console.log(`  Inserindo ${vendaRecords.length} vendas em lotes...`)
  for (let i = 0; i < vendaRecords.length; i += 50) {
    await db.venda.createMany({ data: vendaRecords.slice(i, i + 50) })
  }
  console.log(`  ✓ Vendas inseridas`)

  // Batch insert items
  console.log(`  Inserindo ${itemRecords.length} itens de venda em lotes...`)
  for (let i = 0; i < itemRecords.length; i += 100) {
    await db.itemVenda.createMany({ data: itemRecords.slice(i, i + 100) })
  }
  console.log(`  ✓ Itens inseridos`)

  // Batch insert saida stock movements
  console.log(`  Inserindo ${movSaidaRecords.length} mov. estoque SAIDA em lotes...`)
  for (let i = 0; i < movSaidaRecords.length; i += 100) {
    await db.movimentacaoEstoque.createMany({ data: movSaidaRecords.slice(i, i + 100) })
  }
  console.log(`  ✓ Mov. SAIDA inseridas`)

  // Batch insert financial entries
  console.log(`  Inserindo ${finRecords.length} entradas financeiras em lotes...`)
  for (let i = 0; i < finRecords.length; i += 100) {
    await db.financeiro.createMany({ data: finRecords.slice(i, i + 100) })
  }
  console.log(`  ✓ Financeiro inserido`)

  // ---- Step 4: Create 200 Stock ENTRADAS ----
  console.log('\n[4/5] Criando 200 movimentações de ENTRADA...')
  const motivos = ['Compra de estoque','Reposição','Transferência','Ajuste de estoque','Devolução de cliente','Compra avulsa']
  const entradaRecords: any[] = []

  for (let i = 0; i < 200; i++) {
    const prod = pick(allProducts)
    entradaRecords.push({
      id: randomUUID(),
      produtoId: prod.id,
      tipo: 'ENTRADA',
      quantidade: rand(10, 200),
      estoqueAntes: 0,
      estoqueDepois: 0,
      motivo: pick(motivos)
    })
  }

  for (let i = 0; i < entradaRecords.length; i += 100) {
    await db.movimentacaoEstoque.createMany({ data: entradaRecords.slice(i, i + 100) })
  }
  console.log(`  ✓ ${entradaRecords.length} ENTRADAS inseridas`)

  // ---- Step 5: Update stock and fix movement records ----
  console.log('\n[5/5] Calculando e atualizando estoque...')

  // For each product, recalculate stock from all movements
  for (const product of allProducts) {
    const movs = await db.movimentacaoEstoque.findMany({
      where: { produtoId: product.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, tipo: true, quantidade: true }
    })

    if (movs.length === 0) continue

    // Calculate total change from movements
    let totalChange = 0
    for (const m of movs) {
      totalChange += m.tipo === 'ENTRADA' ? m.quantidade : -m.quantidade
    }

    // Start from 0 before movements, end at totalChange
    // But we want final stock = max(0, totalChange) + original stock from before our seed
    // The original estoqueAtual was from before our seed. Our movements add to that.
    // Actually: the stock movements should reflect what happened. The new estoqueAtual = original + totalChange
    // stockBeforeFirst = original estoqueAtual (before any of our movements)
    const stockBeforeFirst = product.estoqueAtual
    let currentStock = stockBeforeFirst

    // Update each movement with correct antes/depois
    for (const m of movs) {
      const antes = currentStock
      if (m.tipo === 'ENTRADA') {
        currentStock += m.quantidade
      } else {
        currentStock = Math.max(0, currentStock - m.quantidade)
      }
      await db.movimentacaoEstoque.update({
        where: { id: m.id },
        data: { estoqueAntes: antes, estoqueDepois: currentStock }
      })
    }

    // Update product stock to final value
    await db.produto.update({
      where: { id: product.id },
      data: { estoqueAtual: Math.max(0, currentStock) }
    })
  }

  console.log(`  ✓ Estoque atualizado para ${allProducts.length} produtos`)

  // ---- Summary ----
  console.log('\n========================================')
  console.log('  RESUMO FINAL')
  console.log('========================================')

  const fc = await db.cliente.count()
  const fs = await db.venda.count()
  const fi = await db.itemVenda.count()
  const fm = await db.movimentacaoEstoque.count()
  const ff = await db.financeiro.count()

  console.log(`  Clientes:         ${fc}`)
  console.log(`  Vendas:           ${fs}`)
  console.log(`  Itens de Venda:   ${fi}`)
  console.log(`  Mov. Estoque:     ${fm}`)
  console.log(`  Financeiro:       ${ff}`)
  console.log('========================================\n')

  let hasErrors = false
  if (fc < 150) { console.error(`  ✗ Clientes: ${fc} < 150`); hasErrors = true }
  if (fs < 500) { console.error(`  ✗ Vendas: ${fs} < 500`); hasErrors = true }
  if (ff < 1000) { console.error(`  ✗ Financeiro: ${ff} < 1000`); hasErrors = true }
  if (!hasErrors) console.log('  ✓ Todas as verificações passaram!')

  await db.$disconnect()
}

main().catch((e) => { console.error('Erro:', e); process.exit(1) })