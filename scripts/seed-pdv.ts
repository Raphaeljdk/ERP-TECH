import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
function rI(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a }

async function main() {
  const cat = await db.categoria.findFirst({ where: { nome: 'PDV e Automação' } })
  if (!cat) { console.log('no cat'); process.exit(1) }
  const last = await db.produto.findFirst({ where: { codigo: { startsWith: 'PDV' } }, orderBy: { codigo: 'desc' } })
  let n = last ? parseInt(last.codigo.replace('PDV', '')) : 0
  const items = [
    'Automação Comercial NF-e PDV NFC-e','Impressora Térmica Bematech MP-4200 TH','Leitor Óptico Datalogic QuickScan QD2430',
    'Balança Filizola CS-15 Classificador 15kg','Leitor QR Code Zebra DS8178 Sem Fio','Tefil GPOS720 NFC QR Code Boleto',
    'Impressora Térmica Elgin i9 Bluetooth','Gaveta de Dinheiro 5C Elgin USB','Elo Touchscreen 15.6 POS USB',
    'Automação Fiscal Sat Go SAT-CFE','Monitor Touchscreen 10.1 POS','Leitor Biometrico DigitalPersona U.are.U 4500',
    'Mini PC Positivo Drives POS Q420 i3','Display Cliente 7 LCD Positivo','Catraca Eletrônica Controle de Acesso Facial',
    'Detector de Cedulas Safenet D200','Balança de Preço 30kg Toledo Prix','Verificador de Cheques Digital Portátil',
    'Impressora Matricial Epson LX-300+ II','Servidor Ponto i data Advance MFD','Leitor Omnidireccional HP Linear Imager',
    'Cofre Digital Eletrosom CEF 30','Transformador de Energia Nobreak 3KVA','Automação comercial Certilize NFC-e',
    'Mouse Óptico Sem Fio para PDV','Teclado USB ABNT2 PDV 105 Teclas',
  ]
  for (const nome of items) {
    n++
    const c = rI(50, 5000)
    const v = Math.round(c * 1.35)
    await db.produto.create({
      data: {
        codigo: `PDV${String(n).padStart(3, '0')}`, nome, descricao: null,
        precoCusto: c, precoVenda: v,
        estoqueAtual: rI(5, 100), estoqueMinimo: rI(3, 15),
        categoriaId: cat.id, codigoBarras: String(rI(1e12, 9.9e12)),
        unidade: 'UN', status: 'ATIVO',
      }
    })
  }
  console.log(`Total: ${await db.produto.count()} produtos`)
  db.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })