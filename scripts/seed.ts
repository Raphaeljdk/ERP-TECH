import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// ============ CATEGORIES ============
const CATEGORIAS = [
  { nome: 'Notebooks', descricao: 'Laptops e notebooks para trabalho e entretenimento' },
  { nome: 'Desktops', descricao: 'Computadores de mesa completos' },
  { nome: 'Monitores', descricao: 'Displays e monitores para diversos usos' },
  { nome: 'Teclados', descricao: 'Teclados mecânicos, membrana e wireless' },
  { nome: 'Mouses', descricao: 'Mouses ópticos, sem fio e gamers' },
  { nome: 'Memória RAM', descricao: 'Módulos de memória para desktop e notebook' },
  { nome: 'SSDs', descricao: 'Solid State Drives SATA e NVMe' },
  { nome: 'HDs Externos', descricao: 'Armazenamento externo portátil' },
  { nome: 'Placas de Vídeo', descricao: 'GPUs para jogos e trabalho profissional' },
  { nome: 'Processadores', descricao: 'CPUs Intel e AMD' },
  { nome: 'Placas-Mãe', descricao: 'Motherboards para各种 soquetes' },
  { nome: 'Fontes de Alimentação', descricao: 'PSUs para desktops' },
  { nome: 'Gabinetes', descricao: 'Cases e gabinetes para montagem' },
  { nome: 'Impressoras', descricao: 'Impressoras jato de tinta, laser e multifuncionais' },
  { nome: 'Roteadores', descricao: 'Roteadores Wi-Fi para residência e empresa' },
  { nome: 'Switches de Rede', descricao: 'Switches gerenciáveis e não gerenciáveis' },
  { nome: 'Webcams', descricao: 'Câmeras para videoconferência e streaming' },
  { nome: 'Headsets', descricao: 'Fones de ouvido com microfone' },
  { nome: 'Caixas de Som', descricao: 'Alto-falantes e colunas de som' },
  { nome: 'Projetores', descricao: 'Projetores para apresentações e home theater' },
  { nome: 'Nobreaks e UPS', descricao: 'No-breaks para proteção de equipamentos' },
  { nome: 'Cabos e Conectores', descricao: 'Cabos HDMI, USB-C, DisplayPort e outros' },
  { nome: 'Hubs USB', descricao: 'Concentradores e adaptadores USB' },
  { nome: 'Tablets', descricao: 'Tablets para produtividade e lazer' },
  { nome: 'Smartphones', descricao: 'Celulares de diversas marcas' },
  { nome: 'Smartwatches', descricao: 'Relógios inteligentes e wearables' },
  { nome: 'Câmeras de Segurança', descricao: 'Câmeras CFTV para monitoramento' },
  { nome: 'Servidores', descricao: 'Servidores e equipamentos de infraestrutura' },
  { nome: 'Licenças de Software', descricao: 'Software e licenças digitais' },
  { nome: 'Acessórios para Notebook', descricao: 'Coolers, bags, suportes e docks' },
  { nome: 'Coolers e Ventilação', descricao: 'Coolers para CPU, gabinete e notebook' },
  { nome: 'Pendrives', descricao: 'Drives USB flash portáteis' },
  { nome: 'Microfones', descricao: 'Microfones para gravação e streaming' },
  { nome: 'Estabilizadores', descricao: 'Estabilizadores de tensão' },
]

// ============ PRODUCTS ============
const PRODUCTS: { cat: string; items: { nome: string; custo: number; venda: number; unidade: string }[] }[] = [
  // Notebooks
  { cat: 'Notebooks', items: [
    { nome: 'Notebook Dell Inspiron 15 i5-12450H 8GB 256GB SSD', custo: 2800, venda: 3499, unidade: 'UN' },
    { nome: 'Notebook Dell Inspiron 15 i7-1255U 16GB 512GB SSD', custo: 3800, venda: 4799, unidade: 'UN' },
    { nome: 'Notebook Dell XPS 15 i7-1360P 16GB 512GB SSD OLED', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Notebook Dell Latitude 5540 i5-1345U 16GB 256GB SSD', custo: 5200, venda: 6799, unidade: 'UN' },
    { nome: 'Notebook Lenovo IdeaPad 3 i5-1235U 8GB 256GB SSD', custo: 2600, venda: 3299, unidade: 'UN' },
    { nome: 'Notebook Lenovo ThinkPad E14 i5-1240P 8GB 256GB SSD', custo: 3500, venda: 4399, unidade: 'UN' },
    { nome: 'Notebook Lenovo ThinkPad X1 Carbon i7-1365U 16GB 512GB', custo: 9500, venda: 12999, unidade: 'UN' },
    { nome: 'Notebook Lenovo Yoga 7 i7-1355U 16GB 512GB SSD', custo: 5800, venda: 7499, unidade: 'UN' },
    { nome: 'Notebook HP 15-dk2070nz i5-12500H 8GB 256GB SSD', custo: 2900, venda: 3599, unidade: 'UN' },
    { nome: 'Notebook HP Pavilion 15 i7-1255U 16GB 512GB SSD', custo: 4200, venda: 5299, unidade: 'UN' },
    { nome: 'Notebook HP EliteBook 840 G9 i5-1245U 16GB 256GB', custo: 5500, venda: 7199, unidade: 'UN' },
    { nome: 'Notebook HP ProBook 450 G9 i5-1235U 8GB 256GB SSD', custo: 3700, venda: 4699, unidade: 'UN' },
    { nome: 'Notebook Asus VivoBook 15 i5-1235U 8GB 256GB SSD', custo: 2700, venda: 3399, unidade: 'UN' },
    { nome: 'Notebook Asus ZenBook 14 OLED i5-1240P 8GB 256GB', custo: 4800, venda: 5999, unidade: 'UN' },
    { nome: 'Notebook Asus ROG Strix G15 i7-12700H RTX 3060 16GB', custo: 7200, venda: 8999, unidade: 'UN' },
    { nome: 'Notebook Asus TUF Gaming F15 i5-12500H RTX 3050 8GB', custo: 5500, venda: 6999, unidade: 'UN' },
    { nome: 'Notebook Acer Aspire 5 i5-1235U 8GB 256GB SSD', custo: 2500, venda: 3199, unidade: 'UN' },
    { nome: 'Notebook Acer Swift 3 i7-1260P 16GB 512GB SSD', custo: 4600, venda: 5799, unidade: 'UN' },
    { nome: 'Notebook Acer Nitro 5 i5-12500H RTX 3050 Ti 8GB', custo: 5200, venda: 6599, unidade: 'UN' },
    { nome: 'Notebook Apple MacBook Air M2 8GB 256GB SSD', custo: 7200, venda: 9499, unidade: 'UN' },
    { nome: 'Notebook Apple MacBook Air M3 8GB 256GB SSD', custo: 8800, venda: 11499, unidade: 'UN' },
    { nome: 'Notebook Apple MacBook Pro 14 M3 Pro 18GB 512GB', custo: 15000, venda: 19999, unidade: 'UN' },
    { nome: 'Notebook Samsung Galaxy Book3 i7-1355U 16GB 512GB', custo: 5800, venda: 7399, unidade: 'UN' },
    { nome: 'Notebook Samsung Galaxy Book2 Pro 360 i7 16GB 512GB', custo: 6200, venda: 7999, unidade: 'UN' },
    { nome: 'Notebook LG Gram 16 i7-1260P 16GB 256GB SSD', custo: 5500, venda: 6999, unidade: 'UN' },
    { nome: 'Notebook MSI Modern 14 i5-12450H 8GB 256GB SSD', custo: 3000, venda: 3799, unidade: 'UN' },
    { nome: 'Notebook MSI Katana 15 i5-12450H RTX 4050 8GB', custo: 5300, venda: 6799, unidade: 'UN' },
    { nome: 'Notebook Gigabyte A5 K1 i7-12700H RTX 3060 16GB', custo: 6500, venda: 8299, unidade: 'UN' },
    { nome: 'Notebook Positivo Motion Q232A Intel Celeron 4GB 64GB', custo: 1200, venda: 1799, unidade: 'UN' },
    { nome: 'Notebook Lenovo IdeaPad Gaming 3 i5-12450H RTX 3050 8GB', custo: 4800, venda: 5999, unidade: 'UN' },
  ]},
  // Desktops
  { cat: 'Desktops', items: [
    { nome: 'Desktop Dell OptiPlex 7010 i5-12500 8GB 256GB SSD', custo: 3200, venda: 4199, unidade: 'UN' },
    { nome: 'Desktop Dell Vostro 3710 i5-12400 8GB 1TB HD', custo: 2800, venda: 3599, unidade: 'UN' },
    { nome: 'Desktop Lenovo ThinkCentre M70q i5-12400T 8GB 256GB', custo: 3100, venda: 3999, unidade: 'UN' },
    { nome: 'Desktop HP ProDesk 400 G9 i5-12500 8GB 256GB SSD', custo: 3300, venda: 4299, unidade: 'UN' },
    { nome: 'Desktop HP EliteDesk 800 G8 i7-11700 16GB 512GB SSD', custo: 4800, venda: 6199, unidade: 'UN' },
    { nome: 'Desktop Asus ExpertCenter D500 i5-12400 8GB 512GB', custo: 3000, venda: 3899, unidade: 'UN' },
    { nome: 'Desktop Dell XPS 8960 i7-13700 16GB 1TB SSD RTX 3060', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Desktop HP Z2 Tower G9 i7-12700 32GB 1TB SSD', custo: 9500, venda: 12499, unidade: 'UN' },
    { nome: 'Desktop Lenovo Legion T5 i7-12700F 16GB 512GB RTX 3060', custo: 7800, venda: 9999, unidade: 'UN' },
    { nome: 'Desktop Acer Veriton X2670G i5-12400 8GB 256GB SSD', custo: 2700, venda: 3499, unidade: 'UN' },
    { nome: 'Desktop PC Gamer MSI Codex R5 i5-12400F RTX 3060 16GB', custo: 6200, venda: 7999, unidade: 'UN' },
    { nome: 'Mac Mini M2 8GB 256GB SSD', custo: 4200, venda: 5499, unidade: 'UN' },
    { nome: 'iMac 24 M3 8GB 256GB SSD', custo: 9500, venda: 12499, unidade: 'UN' },
    { nome: 'Desktop Positivo Stilo Office Celeron 4GB 500GB', custo: 1400, venda: 1999, unidade: 'UN' },
    { nome: 'Desktop Dell Inspiron 3020 i5-13400 8GB 256GB SSD', custo: 3400, venda: 4399, unidade: 'UN' },
  ]},
  // Monitores
  { cat: 'Monitores', items: [
    { nome: 'Monitor Dell S2421HN 23.8" IPS Full HD 75Hz', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Monitor Dell S2721HN 27" IPS Full HD 75Hz', custo: 950, venda: 1299, unidade: 'UN' },
    { nome: 'Monitor Dell U2723QE 27" 4K USB-C IPS', custo: 2800, venda: 3599, unidade: 'UN' },
    { nome: 'Monitor LG 24MP400 23.8" IPS Full HD 75Hz', custo: 680, venda: 899, unidade: 'UN' },
    { nome: 'Monitor LG 27GP850-B 27" QHD 165Hz IPS', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'Monitor LG 32GQ850-B 32" 4K 240Hz Nano IPS', custo: 5200, venda: 6799, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey G5 27" QHD 165Hz VA', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey G7 32" 4K 240Hz', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Monitor Samsung Smart Monitor M5 27" Full HD', custo: 1000, venda: 1349, unidade: 'UN' },
    { nome: 'Monitor Asus VG279Q 27" Full HD 165Hz IPS', custo: 1600, venda: 2099, unidade: 'UN' },
    { nome: 'Monitor Asus ROG Swift PG27AQN 27" 4K 360Hz', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Monitor Acer Nitro XV272U 27" QHD 170Hz IPS', custo: 1700, venda: 2299, unidade: 'UN' },
    { nome: 'Monitor Acer Predator XB273K 27" 4K 144Hz IPS', custo: 3800, venda: 4999, unidade: 'UN' },
    { nome: 'Monitor HP E24 G5 23.8" IPS Full HD', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Monitor HP Z27k G3 27" 4K USB-C IPS', custo: 2600, venda: 3399, unidade: 'UN' },
    { nome: 'Monitor BenQ PD2700U 27" 4K IPS Designer', custo: 3000, venda: 3899, unidade: 'UN' },
    { nome: 'Monitor AOC 24G2SPU 24" Full HD 165Hz VA', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Monitor Samsung ViewFinity S60A 27" QHD IPS', custo: 1500, venda: 1999, unidade: 'UN' },
    { nome: 'Monitor LG UltraFine 24MD4KL-B 24" 4K USB-C', custo: 3200, venda: 4199, unidade: 'UN' },
    { nome: 'Monitor Dell S3422DW 34" UWQHD 144Hz Curvo', custo: 3500, venda: 4599, unidade: 'UN' },
  ]},
  // Teclados
  { cat: 'Teclados', items: [
    { nome: 'Teclado Mecânico Logitech MX Keys S Wireless', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Teclado Mecânico Logitech G Pro X TKL', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Teclado Mecânico Corsair K70 RGB MK.2', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Teclado Mecânico Corsair K100 RGB', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'Teclado Mecânico Razer BlackWidow V4', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Teclado Mecânico Razer Huntsman V3 Pro', custo: 900, venda: 1299, unidade: 'UN' },
    { nome: 'Teclado HyperX Alloy Origins 60', custo: 400, venda: 549, unidade: 'UN' },
    { nome: 'Teclado HyperX Alloy FPS Pro', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Teclado Redragon K552 Kumara RGB', custo: 120, venda: 199, unidade: 'UN' },
    { nome: 'Teclado Redragon K617 Fizz 60% Wireless', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Teclado Microsoft Sculpt Ergonomic', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Teclado Logitech K380 Multi-Device', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Teclado Logitech K780 Multi-Device', custo: 220, venda: 329, unidade: 'UN' },
    { nome: 'Teclado Dell KB216 USB', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Teclado HP K150 USB', custo: 45, venda: 79, unidade: 'UN' },
    { nome: 'Teclado Mecânico Keychron K2 Wireless', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Teclado Mecânico Keychron Q1 Pro QMK', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Teclado Razer Ornata V3 X', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Teclado Asus ROG Strix Scope RX', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Teclado Mecânico Ducky One 3 Mini', custo: 550, venda: 749, unidade: 'UN' },
  ]},
  // Mouses
  { cat: 'Mouses', items: [
    { nome: 'Mouse Logitech MX Master 3S', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Mouse Logitech G502 X Lightspeed', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Mouse Logitech MX Anywhere 3S', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Mouse Logitech G Pro X Superlight 2', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Mouse Razer DeathAdder V3 Pro', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Mouse Razer Basilisk V3 Pro', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Mouse Razer Viper V3 HyperSpeed', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Mouse Corsair Dark Core RGB Pro', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Mouse Corsair Sabre RGB Pro Wireless', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Mouse HyperX Pulsefire Haste Wireless', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Mouse Microsoft Intellimouse Pro', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Mouse Dell WM126 Wireless', custo: 50, venda: 89, unidade: 'UN' },
    { nome: 'Mouse HP X3000 Wireless', custo: 45, venda: 79, unidade: 'UN' },
    { nome: 'Mouse Asus ROG Gladius III Wireless', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Mouse SteelSeries Prime Wireless', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Mouse Logitech M220 Silent Wireless', custo: 70, venda: 109, unidade: 'UN' },
    { nome: 'Mouse Redragon M601 Ares', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Mouse Zowie EC2-CW Wireless', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Mouse Logitech G305 Lightspeed', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Mouse Razer Orochi V2', custo: 250, venda: 379, unidade: 'UN' },
  ]},
  // Memória RAM
  { cat: 'Memória RAM', items: [
    { nome: 'Memória DDR4 Kingston Fury Beast 8GB 3200MHz', custo: 180, venda: 259, unidade: 'UN' },
    { nome: 'Memória DDR4 Kingston Fury Beast 16GB 3200MHz', custo: 320, venda: 449, unidade: 'UN' },
    { nome: 'Memória DDR4 Kingston Fury Beast 32GB 3200MHz', custo: 580, venda: 799, unidade: 'UN' },
    { nome: 'Memória DDR4 Corsair Vengeance LPX 8GB 3200MHz', custo: 190, venda: 279, unidade: 'UN' },
    { nome: 'Memória DDR4 Corsair Vengeance LPX 16GB 3200MHz', custo: 340, venda: 479, unidade: 'UN' },
    { nome: 'Memória DDR4 Corsair Vengeance LPX 32GB 3200MHz', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Memória DDR4 HyperX FURY 16GB 3200MHz', custo: 310, venda: 439, unidade: 'UN' },
    { nome: 'Memória DDR5 Kingston Fury Beast 16GB 5600MHz', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Memória DDR5 Kingston Fury Beast 32GB 5600MHz', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Memória DDR5 Corsair Vengeance 16GB 6000MHz', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Memória DDR5 Corsair Vengeance 32GB 6000MHz', custo: 780, venda: 1099, unidade: 'UN' },
    { nome: 'Memória DDR5 G.Skill Trident Z5 RGB 32GB 6400MHz', custo: 950, venda: 1349, unidade: 'UN' },
    { nome: 'Memória DDR4 ADATA XPG Spectrix D60G 16GB 3600MHz', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Memória DDR4 Crucial Ballistix 16GB 3200MHz', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Memória DDR5 Crucial Pro 16GB 5600MHz', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Memória Notebook DDR4 Kingston 8GB 2666MHz', custo: 150, venda: 219, unidade: 'UN' },
    { nome: 'Memória Notebook DDR4 Kingston 16GB 3200MHz', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Memória DDR5 G.Skill Trident Z5 Neo 32GB 6000MHz', custo: 880, venda: 1249, unidade: 'UN' },
    { nome: 'Memória DDR4 Corsair Vengeance RGB Pro 32GB 3600MHz', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Memória DDR5 Kingston FURY Renegade 32GB 6400MHz', custo: 850, venda: 1199, unidade: 'UN' },
  ]},
  // SSDs
  { cat: 'SSDs', items: [
    { nome: 'SSD Kingston NV2 250GB NVMe M.2', custo: 110, venda: 169, unidade: 'UN' },
    { nome: 'SSD Kingston NV2 500GB NVMe M.2', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'SSD Kingston NV2 1TB NVMe M.2', custo: 320, venda: 479, unidade: 'UN' },
    { nome: 'SSD Kingston NV2 2TB NVMe M.2', custo: 580, venda: 849, unidade: 'UN' },
    { nome: 'SSD Samsung 980 500GB NVMe M.2', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'SSD Samsung 980 1TB NVMe M.2', custo: 480, venda: 699, unidade: 'UN' },
    { nome: 'SSD Samsung 980 Pro 1TB NVMe Gen4', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'SSD Samsung 990 Pro 1TB NVMe Gen4', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'SSD Samsung 990 Pro 2TB NVMe Gen4', custo: 1200, venda: 1699, unidade: 'UN' },
    { nome: 'SSD WD Blue SN580 500GB NVMe M.2', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'SSD WD Blue SN580 1TB NVMe M.2', custo: 350, venda: 519, unidade: 'UN' },
    { nome: 'SSD WD Black SN850X 1TB NVMe Gen4', custo: 620, venda: 879, unidade: 'UN' },
    { nome: 'SSD WD Black SN850X 2TB NVMe Gen4', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'SSD Corsair MP600 PRO LPX 1TB NVMe Gen4', custo: 580, venda: 829, unidade: 'UN' },
    { nome: 'SSD Crucial P3 Plus 1TB NVMe Gen4', custo: 340, venda: 499, unidade: 'UN' },
    { nome: 'SSD Crucial T500 1TB NVMe Gen4', custo: 550, venda: 779, unidade: 'UN' },
    { nome: 'SSD Kingston A400 480GB SATA', custo: 170, venda: 249, unidade: 'UN' },
    { nome: 'SSD Kingston A400 960GB SATA', custo: 300, venda: 439, unidade: 'UN' },
    { nome: 'SSD Samsung 870 EVO 1TB SATA', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'SSD Samsung 870 EVO 2TB SATA', custo: 780, venda: 1099, unidade: 'UN' },
  ]},
  // HDs Externos
  { cat: 'HDs Externos', items: [
    { nome: 'HD Externo WD Elements 1TB USB 3.0', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'HD Externo WD Elements 2TB USB 3.0', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'HD Externo WD My Passport 1TB USB 3.2', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'HD Externo WD My Passport 2TB USB 3.2', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'HD Externo Seagate Expansion 1TB USB 3.0', custo: 260, venda: 379, unidade: 'UN' },
    { nome: 'HD Externo Seagate Expansion 2TB USB 3.0', custo: 360, venda: 529, unidade: 'UN' },
    { nome: 'HD Externo Seagate One Touch 2TB USB 3.0', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'SSD Externo Samsung T7 500GB USB 3.2', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'SSD Externo Samsung T7 1TB USB 3.2', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'SSD Externo Samsung T7 Shield 1TB USB 3.2', custo: 620, venda: 899, unidade: 'UN' },
    { nome: 'SSD Externo Samsung T9 2TB USB 3.2 Gen2', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'SSD Externo SanDisk Extreme 1TB USB 3.2', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'HD Externo Toshiba Canvio Basics 1TB', custo: 250, venda: 369, unidade: 'UN' },
    { nome: 'HD Externo Toshiba Canvio Advance 2TB', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'SSD Externo Kingston XS2000 1TB USB 3.2', custo: 580, venda: 829, unidade: 'UN' },
  ]},
  // Placas de Vídeo
  { cat: 'Placas de Vídeo', items: [
    { nome: 'RTX 4060 8GB ASUS Dual OC', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'RTX 4060 Ti 8GB MSI Ventus 2X', custo: 2400, venda: 3199, unidade: 'UN' },
    { nome: 'RTX 4060 Ti 16GB Gigabyte Gaming OC', custo: 2700, venda: 3599, unidade: 'UN' },
    { nome: 'RTX 4070 12GB ASUS TUF Gaming', custo: 3200, venda: 4199, unidade: 'UN' },
    { nome: 'RTX 4070 Super 12GB MSI Gaming X', custo: 3600, venda: 4699, unidade: 'UN' },
    { nome: 'RTX 4070 Ti Super 16GB Gigabyte Windforce', custo: 4500, venda: 5899, unidade: 'UN' },
    { nome: 'RTX 4080 Super 16GB ASUS ROG Strix', custo: 6200, venda: 7999, unidade: 'UN' },
    { nome: 'RTX 4090 24GB MSI Suprim X', custo: 11000, venda: 13999, unidade: 'UN' },
    { nome: 'RX 7600 8GB AMD Sapphire Pulse', custo: 1500, venda: 1999, unidade: 'UN' },
    { nome: 'RX 7700 XT 12GB AMD Gigabyte Gaming', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'RX 7800 XT 16GB AMD XFX Mercenary', custo: 2800, venda: 3699, unidade: 'UN' },
    { nome: 'RX 7900 XT 20GB AMD MSI Gaming', custo: 4200, venda: 5499, unidade: 'UN' },
    { nome: 'RX 7900 XTX 24GB AMD Sapphire Nitro+', custo: 5200, venda: 6799, unidade: 'UN' },
    { nome: 'RTX 3060 12GB Gigabyte Gaming OC', custo: 1400, venda: 1849, unidade: 'UN' },
    { nome: 'RTX 3070 8GB ASUS Dual', custo: 1600, venda: 2099, unidade: 'UN' },
    { nome: 'RTX 4070 Ti Super 16GB ZOTAC Trinity', custo: 4400, venda: 5799, unidade: 'UN' },
    { nome: 'RX 6600 8GB XFX Speedster SWFT', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'RTX 4060 8GB Gigabyte Windforce OC', custo: 1750, venda: 2299, unidade: 'UN' },
    { nome: 'RTX 4080 16GB Gigabyte Gaming OC', custo: 5800, venda: 7499, unidade: 'UN' },
    { nome: 'RX 7600 XT 16GB ASUS Dual OC', custo: 1800, venda: 2399, unidade: 'UN' },
  ]},
  // Processadores
  { cat: 'Processadores', items: [
    { nome: 'Intel Core i3-12100F 3.3GHz LGA1700', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Intel Core i5-12400F 2.5GHz LGA1700', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Intel Core i5-12400 2.5GHz LGA1700', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Intel Core i5-13400F 2.5GHz LGA1700', custo: 950, venda: 1299, unidade: 'UN' },
    { nome: 'Intel Core i5-13600K 3.5GHz LGA1700', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'Intel Core i7-13700K 3.4GHz LGA1700', custo: 2100, venda: 2899, unidade: 'UN' },
    { nome: 'Intel Core i7-14700K 3.4GHz LGA1700', custo: 2400, venda: 3299, unidade: 'UN' },
    { nome: 'Intel Core i9-13900K 3.0GHz LGA1700', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Intel Core i9-14900K 3.2GHz LGA1700', custo: 3200, venda: 4299, unidade: 'UN' },
    { nome: 'AMD Ryzen 3 4100 3.8GHz AM4', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 5600X 3.7GHz AM4', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 5600G 3.9GHz AM4', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'AMD Ryzen 7 5800X 3.8GHz AM4', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 7600X 4.7GHz AM5', custo: 1050, venda: 1449, unidade: 'UN' },
    { nome: 'AMD Ryzen 7 7700X 4.5GHz AM5', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'AMD Ryzen 9 7900X 4.7GHz AM5', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'AMD Ryzen 9 7950X 4.5GHz AM5', custo: 2900, venda: 3899, unidade: 'UN' },
    { nome: 'AMD Ryzen 7 7800X3D 4.2GHz AM5', custo: 1900, venda: 2599, unidade: 'UN' },
    { nome: 'Intel Core i5-14400F 2.5GHz LGA1700', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 7500F 3.7GHz AM5', custo: 880, venda: 1199, unidade: 'UN' },
  ]},
  // Placas-Mãe
  { cat: 'Placas-Mãe', items: [
    { nome: 'Placa-Mãe Gigabyte B660M DS3H DDR4 LGA1700', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte B760M DS3H DDR4 LGA1700', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte B760M AORUS Elite DDR5', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI PRO B660M-A DDR4 LGA1700', custo: 520, venda: 719, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI B760M MORTAR DDR5 WiFi', custo: 850, venda: 1149, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS Prime B660M-A DDR4', custo: 530, venda: 729, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS TUF Gaming B760M-PLUS DDR5', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS ROG Strix B760-A D4 WiFi', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'Placa-Mãe ASRock B760M Pro RS DDR4', custo: 480, venda: 669, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte B650M DS3H DDR5 AM5', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI B650 GAMING PLUS WiFi AM5', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Placa-Mãe ASUS ROG Strix B650E-F AM5 DDR5', custo: 1300, venda: 1799, unidade: 'UN' },
    { nome: 'Placa-Mãe ASRock B650M Pro RS WiFi AM5', custo: 700, venda: 949, unidade: 'UN' },
    { nome: 'Placa-Mãe Gigabyte X670E AORUS Master AM5', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Placa-Mãe MSI MAG B660 Tomahawk DDR4 WiFi', custo: 900, venda: 1249, unidade: 'UN' },
  ]},
  // Fontes
  { cat: 'Fontes de Alimentação', items: [
    { nome: 'Fonte Corsair CV550 550W 80+ Bronze', custo: 250, venda: 349, unidade: 'UN' },
    { nome: 'Fonte Corsair RM750 750W 80+ Gold', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Fonte Corsair RM850 850W 80+ Gold', custo: 650, venda: 879, unidade: 'UN' },
    { nome: 'Fonte Corsair HX1200 1200W 80+ Platinum', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'Fonte MSI MAG A650BN 650W 80+ Bronze', custo: 260, venda: 369, unidade: 'UN' },
    { nome: 'Fonte MSI MPG A750G 750W 80+ Gold', custo: 520, venda: 719, unidade: 'UN' },
    { nome: 'Fonte EVGA SuperNOVA 650 G6 650W 80+ Gold', custo: 480, venda: 669, unidade: 'UN' },
    { nome: 'Fonte XPG Pylon 550W 80+ Bronze', custo: 230, venda: 329, unidade: 'UN' },
    { nome: 'Fonte Deepcool PK550D 550W 80+ Bronze', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Fonte Thermaltake Smart 500W 80+ White', custo: 180, venda: 269, unidade: 'UN' },
    { nome: 'Fonte Gigabyte UD750GM 750W 80+ Gold', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Fonte Corsair RMe 850W 80+ Gold', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Fonte Seasonic Focus GX-650 650W 80+ Gold', custo: 580, venda: 799, unidade: 'UN' },
    { nome: 'Fonte Cooler Master MWE 550 V2 550W Bronze', custo: 240, venda: 349, unidade: 'UN' },
    { nome: 'Fonte Corsair TX850M 850W 80+ Bronze', custo: 500, venda: 689, unidade: 'UN' },
  ]},
  // Gabinetes
  { cat: 'Gabinetes', items: [
    { nome: 'Gabinete Corsair 4000D Airflow Mid Tower', custo: 400, venda: 549, unidade: 'UN' },
    { nome: 'Gabinete Corsair 5000D Airflow Mid Tower', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Gabinete NZXT H5 Flow Mid Tower', custo: 450, venda: 619, unidade: 'UN' },
    { nome: 'Gabinete NZXT H7 Flow Mid Tower', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Gabinete Cooler Master MasterBox Q300L', custo: 250, venda: 359, unidade: 'UN' },
    { nome: 'Gabinete Cooler Master MasterBox TD500 Mesh', custo: 450, venda: 619, unidade: 'UN' },
    { nome: 'Gabinete Lian Li Lancool II Mesh', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Gabinete Fractal Design Pop Air', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Gabinete Fractal Design Meshify 2 Compact', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Gabinete ASUS ROG Strix Helios', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Gabinete Thermaltake S200 TG ARGB', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Gabinete Montech AIR 903 Max', custo: 300, venda: 429, unidade: 'UN' },
    { nome: 'Gabinete Deepcool CC560 ARGB', custo: 230, venda: 339, unidade: 'UN' },
    { nome: 'Gabinete Pichau Apus PTG-BK', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Gabinete Redragon Arrow, Mid Tower', custo: 180, venda: 269, unidade: 'UN' },
  ]},
  // Impressoras
  { cat: 'Impressoras', items: [
    { nome: 'Impressora HP DeskJet 2755e Multifuncional Wi-Fi', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Impressora HP LaserJet Pro M404dn Mono', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Impressora HP LaserJet Pro MFP M428fdw Color', custo: 2800, venda: 3699, unidade: 'UN' },
    { nome: 'Impressora HP Color LaserJet Pro M255dw', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'Impressora Canon PIXMA G3020 Multifuncional Tank', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Impressora Canon PIXMA G4020 Multifuncional Tank', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Impressora Canon imageCLASS MF269dw Laser Mono', custo: 2600, venda: 3399, unidade: 'UN' },
    { nome: 'Impressora Epson Ecotank L3250 Multifuncional Wi-Fi', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Impressora Epson Ecotank L4260 Color Wi-Fi', custo: 850, venda: 1199, unidade: 'UN' },
    { nome: 'Impressora Brother HL-L2350DW Laser Mono Wi-Fi', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Impressora Brother DCP-L2550DW Laser Mono MFC', custo: 1300, venda: 1799, unidade: 'UN' },
    { nome: 'Impressora Brother MFC-L2750DW Laser Color MFC', custo: 2800, venda: 3699, unidade: 'UN' },
    { nome: 'Impressora HP DeskJet 1115 Jato de Tinta', custo: 220, venda: 329, unidade: 'UN' },
    { nome: 'Impressora Canon PIXMA MegaTank G6020', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Impressora Epson WorkForce Pro WF-3820', custo: 1800, venda: 2399, unidade: 'UN' },
  ]},
  // Roteadores
  { cat: 'Roteadores', items: [
    { nome: 'Roteador TP-Link Archer C6 AC1200', custo: 180, venda: 269, unidade: 'UN' },
    { nome: 'Roteador TP-Link Archer C80 AC1900', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Roteador TP-Link Archer AX73 AX5400', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Roteador TP-Link Archer AX73 Pro AX6000', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Roteador TP-Link Deco M5 Mesh Wi-Fi 3-pack', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Roteador D-Link DIR-842 AC1200', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Roteador D-Link Eagle R32 AX3000', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Roteador Asus RT-AX58U AX3000', custo: 480, venda: 669, unidade: 'UN' },
    { nome: 'Roteador Asus RT-AX86U AX5700', custo: 850, venda: 1149, unidade: 'UN' },
    { nome: 'Roteador Netgear Orbi RBK753 Mesh Wi-Fi 6', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'Roteador Xiaomi Router AX3000T', custo: 250, venda: 369, unidade: 'UN' },
    { nome: 'Roteador TP-Link Archer AX55 AX3000', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Roteador Mercusys MR30G AX3000', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Roteador Intelbras Wi-Fi 6 AX3000', custo: 300, venda: 449, unidade: 'UN' },
    { nome: 'Roteador Linksys Atlas Max 6 AX5400', custo: 900, venda: 1249, unidade: 'UN' },
  ]},
  // Switches
  { cat: 'Switches de Rede', items: [
    { nome: 'Switch TP-Link TL-SG1005D 5 Portas Gigabit', custo: 100, venda: 159, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG1008D 8 Portas Gigabit', custo: 160, venda: 249, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG1016D 16 Portas Gigabit', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG1024D 24 Portas Gigabit', custo: 550, venda: 769, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG2008P 8 Portas PoE Gerenciável', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Switch D-Link DGS-1005A 5 Portas Gigabit', custo: 90, venda: 149, unidade: 'UN' },
    { nome: 'Switch D-Link DGS-1100-08 8 Portas Gerenciável', custo: 450, venda: 629, unidade: 'UN' },
    { nome: 'Switch D-Link DGS-1210-24 24 Portas Gerenciável', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Switch HP 1820-8G J9980A 8 Portas Gerenciável', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Switch HP 1820-24G J9982A 24 Portas Gerenciável', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Switch Ubiquiti UniFi Switch 8 PoE', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Switch Ubiquiti UniFi Switch 24 PoE', custo: 2400, venda: 3299, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SF1008P 8 Portas Fast PoE', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Switch Intelbras GS1216P 16 Portas PoE', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Switch TP-Link TL-SG2210P 8 Portas PoE+ Gerenciável', custo: 950, venda: 1299, unidade: 'UN' },
  ]},
  // Webcams
  { cat: 'Webcams', items: [
    { nome: 'Webcam Logitech C270 HD 720p', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Webcam Logitech C505 HD 720p', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Webcam Logitech C920 HD Pro 1080p', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Webcam Logitech C922 Pro Stream 1080p', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Webcam Logitech Brio 4K Ultra HD', custo: 900, venda: 1299, unidade: 'UN' },
    { nome: 'Webcam Logitech Brio 500 1080p AutoFrame', custo: 650, venda: 949, unidade: 'UN' },
    { nome: 'Webcam Microsoft LifeCam HD-3000', custo: 100, venda: 159, unidade: 'UN' },
    { nome: 'Webcam Razer Kiyo Pro 1080p 60fps', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Webcam Elgato Facecam 1080p 60fps', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Webcam Insta360 Link 4K', custo: 900, venda: 1249, unidade: 'UN' },
  ]},
  // Headsets
  { cat: 'Headsets', items: [
    { nome: 'Headset Logitech H390 USB', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Headset Logitech H540 USB', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Headset Logitech G432 7.1 Surround', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Headset Logitech G435 Lightspeed Wireless', custo: 300, venda: 449, unidade: 'UN' },
    { nome: 'Headset Logitech G733 Lightspeed Wireless', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Headset Logitech G Pro X 2 Lightspeed', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Headset HyperX Cloud Stinger 2', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Headset HyperX Cloud II 7.1', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Headset HyperX Cloud III Wireless', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Headset Razer Kraken V3 X', custo: 280, venda: 419, unidade: 'UN' },
    { nome: 'Headset Razer BlackShark V2 X', custo: 300, venda: 449, unidade: 'UN' },
    { nome: 'Headset Razer Barracuda Pro Wireless', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Headset Corsair HS55 Wireless', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Headset Corsair Void Elite RGB', custo: 320, venda: 459, unidade: 'UN' },
    { nome: 'Headset Sony WH-1000XM5 Bluetooth', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Headset JBL Tune 520BT Bluetooth', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Headset Redragon Zeus 7.1 RGB', custo: 120, venda: 199, unidade: 'UN' },
    { nome: 'Headset SteelSeries Arctis Nova 3', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Headset Audio-Technica ATH-M20x', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Headset Bose QuietComfort 45 Bluetooth', custo: 1500, venda: 2049, unidade: 'UN' },
  ]},
  // Caixas de Som
  { cat: 'Caixas de Som', items: [
    { nome: 'Caixa de Som JBL Go 3 Bluetooth', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Caixa de Som JBL Flip 6 Bluetooth', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Caixa de Som JBL Charge 5 Bluetooth', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Caixa de Som Bose SoundLink Mini II', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Caixa de Som Bose SoundLink Revolve+', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Caixa de Som Sony SRS-XB13 Bluetooth', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Caixa de Som Sony SRS-XE300 Bluetooth', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Caixa de Som Harman Kardon Aura Studio 3', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'Caixa de Som Edifier R1280Ts 2.0', custo: 250, venda: 379, unidade: 'PÇ' },
    { nome: 'Caixa de Som Logitech Z407 Bluetooth 2.1', custo: 350, venda: 499, unidade: 'PÇ' },
    { nome: 'Caixa de Som Creative Pebble V3 USB', custo: 150, venda: 229, unidade: 'PÇ' },
    { nome: 'Caixa de Som Marshall Emberton II Bluetooth', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Caixa de Som JBL PartyBox Encore Essential', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Caixa de Som Samsung Sound Tower MX-ST40B', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Caixa de Som Xiaomi Soundbox Bluetooth', custo: 100, venda: 169, unidade: 'UN' },
  ]},
  // Projetores
  { cat: 'Projetores', items: [
    { nome: 'Projetor Epson EB-X51 3LCD XGA', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Projetor Epson EB-W52 3LCD WXGA', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Projetor Epson EB-FH52 3LCD Full HD', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'Projetor BenQ MH535A Full HD DLP', custo: 2600, venda: 3499, unidade: 'UN' },
    { nome: 'Projetor BenQ TH585P Full HD 1080p', custo: 3200, venda: 4299, unidade: 'UN' },
    { nome: 'Projetor Optoma HD146X Full HD DLP', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Projetor Samsung The Freestyle FHD Smart', custo: 3500, venda: 4799, unidade: 'UN' },
    { nome: 'Projetor LG CineBeam PF610P Full HD', custo: 2400, venda: 3299, unidade: 'UN' },
    { nome: 'Projetor ViewSonic PX701-4K 4K UHD', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Projetor Epson EB-L730U Laser WUXGA', custo: 15000, venda: 19999, unidade: 'UN' },
  ]},
  // Nobreaks
  { cat: 'Nobreaks e UPS', items: [
    { nome: 'Nobreak SMS Net Pro 600VA Bivolt', custo: 220, venda: 329, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Pro 1000VA Bivolt', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Pro 1400VA Bivolt', custo: 480, venda: 689, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Crown 1000VA Tower', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Crown 1400VA Tower', custo: 520, venda: 749, unidade: 'UN' },
    { nome: 'Nobreak SMS Net Face 1200VAI inteligente', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Nobreak APC BK650-VM 650VA', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Nobreak APC Back-UPS Pro 1500VA', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Nobreak APC Smart-UPS 1500VA LCD', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Nobreak Brastemp BNE30 300VA', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Nobreak Intelbras NI 1000 1000VA', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Nobreak UPS Nobreak 3KVA Online', custo: 3500, venda: 4799, unidade: 'UN' },
  ]},
  // Cabos
  { cat: 'Cabos e Conectores', items: [
    { nome: 'Cabo HDMI 2.1 2m Premium', custo: 25, venda: 49, unidade: 'UN' },
    { nome: 'Cabo HDMI 2.1 3m Premium', custo: 35, venda: 69, unidade: 'UN' },
    { nome: 'Cabo HDMI 2.1 5m Premium', custo: 55, venda: 99, unidade: 'UN' },
    { nome: 'Cabo DisplayPort 1.4 2m', custo: 30, venda: 59, unidade: 'UN' },
    { nome: 'Cabo USB-C para USB-C 2m 100W', custo: 25, venda: 49, unidade: 'UN' },
    { nome: 'Cabo USB-C para HDMI 4K 2m', custo: 45, venda: 89, unidade: 'UN' },
    { nome: 'Cabo USB-C para DisplayPort 1.4 2m', custo: 40, venda: 79, unidade: 'UN' },
    { nome: 'Cabo USB-A para USB-B 2m Impressora', custo: 12, venda: 25, unidade: 'UN' },
    { nome: 'Cabo USB 3.0 Type-A 2m', custo: 15, venda: 29, unidade: 'UN' },
    { nome: 'Cabo Extensão USB 3.0 Hub 3 Portas 1m', custo: 35, venda: 59, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6 UTP 5m', custo: 12, venda: 24, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6 UTP 10m', custo: 20, venda: 39, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6 UTP 20m', custo: 35, venda: 69, unidade: 'UN' },
    { nome: 'Cabo Ethernet Cat6 FTP 5m', custo: 18, venda: 34, unidade: 'UN' },
    { nome: 'Cabo VGA 15m Premium', custo: 25, venda: 49, unidade: 'UN' },
    { nome: 'Adaptador USB-C para USB-A Fêmea', custo: 12, venda: 24, unidade: 'UN' },
    { nome: 'Adaptador HDMI para VGA', custo: 30, venda: 59, unidade: 'UN' },
    { nome: 'Adaptador DisplayPort para HDMI', custo: 35, venda: 69, unidade: 'UN' },
    { nome: 'Cabo de Força Nobreak Padrão 1.8m', custo: 15, venda: 29, unidade: 'UN' },
    { nome: 'Cabo USB-C para USB-A 1m 3A', custo: 12, venda: 24, unidade: 'UN' },
  ]},
  // Hubs USB
  { cat: 'Hubs USB', items: [
    { nome: 'Hub USB-C 7 Portas Anker', custo: 200, venda: 329, unidade: 'UN' },
    { nome: 'Hub USB-C 4 Portas Anker PowerDelivery', custo: 350, venda: 549, unidade: 'UN' },
    { nome: 'Hub USB-C 10 Portas TP-Link UH700', custo: 280, venda: 429, unidade: 'UN' },
    { nome: 'Hub USB 3.0 4 Portas Multilaser', custo: 50, venda: 89, unidade: 'UN' },
    { nome: 'Hub USB-C 6 Portas Dell DA300', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Hub USB-C Multiport HDMI VGA RJ45', custo: 180, venda: 299, unidade: 'UN' },
    { nome: 'Dock Station USB-C Dell D6000', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Dock Station USB-C CalDigit TS4', custo: 2500, venda: 3299, unidade: 'UN' },
    { nome: 'Hub USB 3.0 7 Portas AC Power', custo: 100, venda: 169, unidade: 'UN' },
    { nome: 'Hub USB-C para Ethernet HDMI SD Card', custo: 150, venda: 249, unidade: 'UN' },
  ]},
  // Tablets
  { cat: 'Tablets', items: [
    { nome: 'Tablet Samsung Galaxy Tab A9 8.7" 64GB', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Tablet Samsung Galaxy Tab S6 Lite 10.4" 64GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Tablet Samsung Galaxy Tab S9 FE 10.9" 128GB', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'Tablet Samsung Galaxy Tab S9 11" 128GB', custo: 3500, venda: 4699, unidade: 'UN' },
    { nome: 'Tablet iPad 10ª geração 10.9" 64GB Wi-Fi', custo: 3200, venda: 4299, unidade: 'UN' },
    { nome: 'Tablet iPad Air M2 11" 128GB Wi-Fi', custo: 4800, venda: 6499, unidade: 'UN' },
    { nome: 'Tablet iPad Pro M2 11" 128GB Wi-Fi', custo: 7000, venda: 9499, unidade: 'UN' },
    { nome: 'Tablet Lenovo Tab M10 Plus 10.3" 64GB', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Tablet Lenovo Tab P11 Pro 11.5" 128GB', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Tablet Multilaser M7S 7" 32GB', custo: 250, venda: 399, unidade: 'UN' },
  ]},
  // Smartphones
  { cat: 'Smartphones', items: [
    { nome: 'Smartphone Samsung Galaxy A15 4G 64GB', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A25 5G 128GB', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A35 5G 128GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy A55 5G 128GB', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S24 128GB', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S24+ 256GB', custo: 4000, venda: 5299, unidade: 'UN' },
    { nome: 'Smartphone Samsung Galaxy S24 Ultra 256GB', custo: 6000, venda: 7999, unidade: 'UN' },
    { nome: 'Smartphone Motorola Moto G34 5G 128GB', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Smartphone Motorola Moto G84 5G 128GB', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Smartphone Motorola Edge 50 128GB', custo: 1500, venda: 1999, unidade: 'UN' },
    { nome: 'Smartphone Xiaomi Redmi Note 13 128GB', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Smartphone Xiaomi Poco X6 Pro 256GB', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'Smartphone iPhone 15 128GB', custo: 3800, venda: 4999, unidade: 'UN' },
    { nome: 'Smartphone iPhone 15 Pro 128GB', custo: 5500, venda: 7299, unidade: 'UN' },
    { nome: 'Smartphone iPhone 15 Pro Max 256GB', custo: 7000, venda: 9299, unidade: 'UN' },
  ]},
  // Smartwatches
  { cat: 'Smartwatches', items: [
    { nome: 'Smartwatch Samsung Galaxy Watch FE 40mm', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Smartwatch Samsung Galaxy Watch6 40mm', custo: 1200, venda: 1699, unidade: 'UN' },
    { nome: 'Smartwatch Samsung Galaxy Watch6 Classic 47mm', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Smartwatch Apple Watch SE 2ª geração GPS', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Smartwatch Apple Watch Series 9 GPS', custo: 2800, venda: 3799, unidade: 'UN' },
    { nome: 'Smartwatch Apple Watch Ultra 2 GPS+Cellular', custo: 5500, venda: 7299, unidade: 'UN' },
    { nome: 'Smartwatch Xiaomi Redmi Watch 4', custo: 200, venda: 349, unidade: 'UN' },
    { nome: 'Smartwatch Xiaomi Watch S3 Active', custo: 350, venda: 549, unidade: 'UN' },
    { nome: 'Smartwatch Huawei Watch GT 4 46mm', custo: 900, venda: 1299, unidade: 'UN' },
    { nome: 'Smartwatch Amazfit Bip 5', custo: 300, venda: 449, unidade: 'UN' },
  ]},
  // Câmeras de Segurança
  { cat: 'Câmeras de Segurança', items: [
    { nome: 'Câmera IP Wi-Fi 1080p Intelbras VIP 5600 B', custo: 200, venda: 329, unidade: 'UN' },
    { nome: 'Câmera IP Wi-Fi 2MP Intelbras VIP 3230 B SLIM', custo: 180, venda: 299, unidade: 'UN' },
    { nome: 'Câmera IP PoE 4MP Intelbras VIP 5800 B SLIM', custo: 350, venda: 549, unidade: 'UN' },
    { nome: 'Câmera IP Externa 3MP Hikvision DS-2CD2T47G2', custo: 400, venda: 629, unidade: 'UN' },
    { nome: 'Câmera IP Externa 4MP Hikvision DS-2CD2T47G2-L', custo: 500, venda: 779, unidade: 'UN' },
    { nome: 'Kit CFTV 8 Canais HD Intelbras VN 8120 HP', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Kit CFTV 16 Canais HD Intelbras VN 16160 HP', custo: 3200, venda: 4499, unidade: 'UN' },
    { nome: 'DVR 8 Canais HD Intelbras VD 4108 H', custo: 450, venda: 689, unidade: 'UN' },
    { nome: 'DVR 16 Canais HD Intelbras VD 4116 H', custo: 700, venda: 1049, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi TP-Link Tapo C200 1080p', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi TP-Link Tapo C320WS Exterior', custo: 280, venda: 449, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi Xiaomi IMILAB C22 1080p', custo: 130, venda: 219, unidade: 'UN' },
    { nome: 'Câmera IP Bullet 5MP Dahua DH-IPC-HFW2431T', custo: 450, venda: 699, unidade: 'UN' },
    { nome: 'Câmera Dome Interna 4MP Hikvision DS-2CD2143G2', custo: 350, venda: 549, unidade: 'UN' },
    { nome: 'Kit 4 Câmeras Wi-Fi TP-Link Tapo Hub', custo: 800, venda: 1199, unidade: 'UN' },
  ]},
  // Servidores
  { cat: 'Servidores', items: [
    { nome: 'Servidor Dell PowerEdge T150 Xeon E-2314 16GB', custo: 8000, venda: 10499, unidade: 'UN' },
    { nome: 'Servidor Dell PowerEdge T350 Xeon E-2388G 32GB', custo: 12000, venda: 15999, unidade: 'UN' },
    { nome: 'Servidor HP ProLiant ML110 G10 Xeon E-2314 16GB', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Servidor HP ProLiant DL360 Gen10 Xeon Silver', custo: 18000, venda: 23999, unidade: 'UN' },
    { nome: 'Servidor Lenovo ThinkSystem ST50 Xeon E-2300 16GB', custo: 9000, venda: 11999, unidade: 'UN' },
    { nome: 'NAS QNAP TS-233 2-Bay ARM', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'NAS Synology DS224+ 2-Bay Intel', custo: 2500, venda: 3299, unidade: 'UN' },
    { nome: 'NAS Synology DS923+ 4-Bay AMD', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Servidor Torre Custom Xeon E-2236 32GB RAID', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Rack 12U Padrão 19" Ventilado', custo: 800, venda: 1099, unidade: 'UN' },
  ]},
  // Licenças
  { cat: 'Licenças de Software', items: [
    { nome: 'Licença Windows 11 Pro 64-bit OEM', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Licença Windows 11 Home 64-bit OEM', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Licença Microsoft Office 2021 Home & Student', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Licença Microsoft Office 2024 Professional', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Licença Microsoft 365 Personal 1 Ano', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Licença Microsoft 365 Family 1 Ano', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Licença Windows Server 2022 Standard', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Licença Windows Server 2022 Datacenter', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Licença Kaspersky Endpoint Security 1 Ano', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Licença Kaspersky Total Security 3 Dispositivos', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Assinatura Adobe Creative Cloud Completa 1 Ano', custo: 3500, venda: 4599, unidade: 'UN' },
    { nome: 'Licença Bitdefender GravityZone Business', custo: 200, venda: 319, unidade: 'UN' },
  ]},
  // Acessórios Notebook
  { cat: 'Acessórios para Notebook', items: [
    { nome: 'Cooler Notebook Targeus NBB-500 USB', custo: 45, venda: 79, unidade: 'UN' },
    { nome: 'Cooler Notebook Cooler Master NotePal X3', custo: 180, venda: 279, unidade: 'UN' },
    { nome: 'Mochila Notebook Targus 15.6" CityGear', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Mochila Notebook Dell Pro 15.6"', custo: 200, venda: 319, unidade: 'UN' },
    { nome: 'Mochila Notebook Samsonite Xenon 3.0 15.6"', custo: 350, venda: 529, unidade: 'UN' },
    { nome: 'Suporte Notebook Alumínio Ajustável', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Dock Station USB-C Dell D6000', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Dock Station USB-C HP USB-C G5', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Base Refrigerante Notebook N35 Degree', custo: 80, venda: 139, unidade: 'UN' },
    { nome: 'Case Notebook 14" Neoprene Universal', custo: 30, venda: 59, unidade: 'UN' },
    { nome: 'Mouse Pad Notebook Portátil', custo: 20, venda: 39, unidade: 'UN' },
    { nome: 'Fechadura Notebook Kensington Slot', custo: 35, venda: 69, unidade: 'UN' },
    { nome: 'Carregador Universal Notebook 90W', custo: 120, venda: 199, unidade: 'UN' },
    { nome: 'Protetor de Tela Notebook 15.6" Anti-Reflexo', custo: 35, venda: 69, unidade: 'UN' },
    { nome: 'Bateria Notebook Universal 11.1V 4400mAh', custo: 150, venda: 239, unidade: 'UN' },
  ]},
  // Coolers
  { cat: 'Coolers e Ventilação', items: [
    { nome: 'Cooler CPU Corsair iCUE H100i Elite Capellix', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Cooler CPU Corsair iCUE H150i Elite LCD', custo: 1100, venda: 1549, unidade: 'UN' },
    { nome: 'Cooler CPU NZXT Kraken X63 RGB 280mm', custo: 750, venda: 1049, unidade: 'UN' },
    { nome: 'Cooler CPU NZXT Kraken X73 RGB 360mm', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Cooler CPU Deepcool AK620 Dual Tower', custo: 250, venda: 369, unidade: 'UN' },
    { nome: 'Cooler CPU Noctua NH-D15 chromax.black', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Cooler CPU be quiet! Dark Rock Pro 5', custo: 450, venda: 629, unidade: 'UN' },
    { nome: 'Cooler CPU Cooler Master Hyper 212 Spectrum', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Fan 120mm Corsair AF120 RGB (2-pack)', custo: 120, venda: 179, unidade: 'PÇ' },
    { nome: 'Fan 120mm Noctua NF-A12x25', custo: 100, venda: 149, unidade: 'UN' },
    { nome: 'Fan 140mm be quiet! Silent Wings 4', custo: 110, venda: 169, unidade: 'UN' },
    { nome: 'Fan 200mm ARGB Fractal Design Prisma', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'Pasta Térmica Noctua NT-H1 3.5g', custo: 30, venda: 49, unidade: 'UN' },
    { nome: 'Pasta Térmica Arctic MX-6 8g', custo: 40, venda: 69, unidade: 'UN' },
    { nome: 'Cooler CPU Thermalright Peerless Assassin 120', custo: 180, venda: 269, unidade: 'UN' },
  ]},
  // Pendrives
  { cat: 'Pendrives', items: [
    { nome: 'Pendrive SanDisk Cruzer Blade 16GB USB 2.0', custo: 18, venda: 34, unidade: 'UN' },
    { nome: 'Pendrive SanDisk Cruzer Blade 32GB USB 2.0', custo: 22, venda: 42, unidade: 'UN' },
    { nome: 'Pendrive SanDisk Ultra Fit 64GB USB 3.1', custo: 40, venda: 69, unidade: 'UN' },
    { nome: 'Pendrive SanDisk Ultra Flair 128GB USB 3.0', custo: 55, venda: 89, unidade: 'UN' },
    { nome: 'Pendrive Kingston DataTraveler 100G3 32GB USB 3.0', custo: 25, venda: 45, unidade: 'UN' },
    { nome: 'Pendrive Kingston DataTraveler 100G3 64GB USB 3.0', custo: 40, venda: 69, unidade: 'UN' },
    { nome: 'Pendrive Kingston DataTraveler Max 256GB USB 3.2', custo: 130, venda: 199, unidade: 'UN' },
    { nome: 'Pendrive Kingston DTSE9G3 32GB USB 3.0', custo: 22, venda: 39, unidade: 'UN' },
    { nome: 'Pendrive Samsung FIT Plus 128GB USB 3.1', custo: 65, venda: 109, unidade: 'UN' },
    { nome: 'Pendrive Samsung BAR Plus 128GB USB 3.1', custo: 70, venda: 119, unidade: 'UN' },
    { nome: 'Pendrive PNY Turbo 256GB USB 3.0', custo: 100, venda: 169, unidade: 'UN' },
    { nome: 'Pendrive Corsair Flash Voyager GTX 256GB USB 3.1', custo: 180, venda: 279, unidade: 'UN' },
  ]},
  // Microfones
  { cat: 'Microfones', items: [
    { nome: 'Microfone Condensador Fifine K688 USB', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Microfone Condensador Fifine A8 USB', custo: 200, venda: 329, unidade: 'UN' },
    { nome: 'Microfone USB Blue Yeti', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Microfone USB Blue Snowball iCE', custo: 300, venda: 449, unidade: 'UN' },
    { nome: 'Microfone HyperX SoloCast USB', custo: 250, venda: 379, unidade: 'UN' },
    { nome: 'Microfone HyperX DuoCast USB', custo: 450, venda: 669, unidade: 'UN' },
    { nome: 'Microfone Razer Seiren Mini USB', custo: 200, venda: 319, unidade: 'UN' },
    { nome: 'Microfone Elgato Wave:3 USB', custo: 600, venda: 849, unidade: 'UN' },
    { nome: 'Microfone Fifine AmpliGame AM8 XLR+USB', custo: 350, venda: 529, unidade: 'UN' },
    { nome: 'Microfone Condensador Audio-Technica AT2020', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Microfone Samson Q2U USB/XLR Dinâmico', custo: 350, venda: 529, unidade: 'UN' },
    { nome: 'Microfone Rode NT-USB Mini', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Microfone Fifine K678 USB com Boom Arm', custo: 220, venda: 349, unidade: 'UN' },
    { nome: 'Microfone Streaming Razer Seiren V2 Pro', custo: 650, venda: 949, unidade: 'UN' },
    { nome: 'Suporte de Microfone Boom Arm Desktop', custo: 80, venda: 139, unidade: 'UN' },
  ]},
  // Estabilizadores
  { cat: 'Estabilizadores', items: [
    { nome: 'Estabilizador SMS Eletrônico 300VA bivolt', custo: 80, venda: 129, unidade: 'UN' },
    { nome: 'Estabilizador SMS Eletrônico 500VA bivolt', custo: 110, venda: 179, unidade: 'UN' },
    { nome: 'Estabilizador SMS Eletrônico 800VA bivolt', custo: 150, venda: 249, unidade: 'UN' },
    { nome: 'Estabilizador SMS Eletrônico 1000VA bivolt', custo: 180, venda: 299, unidade: 'UN' },
    { nome: 'Estabilizador SMS Intelligent 1000VA bivolt', custo: 200, venda: 329, unidade: 'UN' },
    { nome: 'Estabilizador Intelbras EST 1500 1500VA', custo: 250, venda: 399, unidade: 'UN' },
    { nome: 'Estabilizador Climax 300VA', custo: 70, venda: 119, unidade: 'UN' },
    { nome: 'Estabilizador Climax 600VA', custo: 100, venda: 169, unidade: 'UN' },
    { nome: 'Estabilizador Bivolt SMS 2000VA', custo: 280, venda: 449, unidade: 'UN' },
    { nome: 'Estabilizador Força 800VA 2 Tomadas', custo: 120, venda: 199, unidade: 'UN' },
  ]},
]

// ============ CLIENTS ============
const NOMES = [
  'João Silva Santos','Maria Oliveira Costa','Carlos Eduardo Souza','Ana Paula Ferreira Lima','Pedro Henrique Almeida',
  'Juliana Rodrigues Pereira','Lucas Gabriel Martins','Fernanda Costa Ribeiro','Rafael da Silva Nascimento','Camila Aparecida Dias',
  'Bruno Miguel Araújo','Larissa Beatriz Cardoso','Gabriel José Moreira','Isabela Santos Rocha','Thiago Luiz Barbosa',
  'Amanda Cristina Vieira','Matheus Felipe Gomes','Natália Fernanda Nunes','Diego Ricardo Carvalho','Valentina Ribeiro Duarte',
  'Leandro Augusto Teixeira','Priscila de Fátima Moura','André Luís Monteiro','Beatriz Souza Farias','Rodrigo Pinto Machado',
  'Caroline Abreu Ramos','Felipe Andrés Castillo','Mariana Trindade Fonseca','Gustavo Henrique Pires','Letícia Chaves Freitas',
  'Vinícius de Moraes','Roberto Carlos Assunção','Patrícia Aparecida Guimarães','Eduardo Nascimento Prado','Daniela Silva Mendes',
  'Marcos Antônio Rezende','Lúcia Helena Fagundes','Ricardo Tavares Bastos','Adriana Camargo Pinto','Alexandre Peixoto Lemos',
  'Cristiane Moura e Silva','Fábio de Oliveira Guedes','Renata Vasconcelos Dutra','Evandro Pereira da Cunha','Sônia Regina Alves',
  'Henrique Dias Furtado','Mônica Azevedo Queiroz','Caio César Magalhães','Elaine Cristina Palma','Wagner Santos Bittencourt',
  'Tatiana Rodrigues Peixoto','Robson Alves Feitosa','Cintia Maria Barros','Marcelo José Goulart','Vanessa Ferreira da Luz',
]

const SOBRENOMOS = ['','Jr.','Filho','Neto','Sobrinho']

const LOGRADOUROS = [
  'Rua Augusta','Av. Paulista','Rua Oscar Freire','Rua Haddock Lobo','Av. Rebouças','Rua da Consolação',
  'Av. Faria Lima','Rua Joaquim Floriano','Av. Brasil','Rua Voluntários da Pátria','Rua da Assembléia',
  'Av. Rio Branco','Rua do Ouvidor','Av. Presidente Vargas','Rua da Quitanda','Av. Atlântica',
  'Rua Dias Ferreira','Av. Nossa Senhora de Copacabana','Rua Santa Clara','Av. Ipiranga',
  'Rua da Bahia','Av. Afonso Pena','Rua Espírito Santo','Av. do Contorno',
  'Rua dos Andradas','Av. Borges de Medeiros','Rua Voluntários da Pátria',
  'Rua da Glória','Rua 24 de Maio','Av. Sete de Setembro','Av. Ipanema',
]

const BAIRROS = [
  'Centro','Jardins','Vila Mariana','Moema','Pinheiros','Itaim Bibi','Consolação','Bela Vista',
  'Copacabana','Ipanema','Leblon','Botafogo','Flamengo','Tijuca','Barra da Tijuca',
  'Savassi','Funcionários','Pampulha','Lourdes','Sion',
  'Centro Histórico','Menino Deus','Petrópolis','Três Figueiras','Moinhos de Vento',
  'Boa Viagem','Piedade','Madalena','Graças','Torre',
]

const CIDADES_ESTADOS: { cidade: string; estado: string }[] = [
  { cidade: 'São Paulo', estado: 'SP' }, { cidade: 'Campinas', estado: 'SP' },
  { cidade: 'Santos', estado: 'SP' }, { cidade: 'Ribeirão Preto', estado: 'SP' },
  { cidade: 'Sorocaba', estado: 'SP' }, { cidade: 'São José dos Campos', estado: 'SP' },
  { cidade: 'Rio de Janeiro', estado: 'RJ' }, { cidade: 'Niterói', estado: 'RJ' },
  { cidade: 'Petrópolis', estado: 'RJ' }, { cidade: 'Duque de Caxias', estado: 'RJ' },
  { cidade: 'Belo Horizonte', estado: 'MG' }, { cidade: 'Uberlândia', estado: 'MG' },
  { cidade: 'Contagem', estado: 'MG' }, { cidade: 'Juiz de Fora', estado: 'MG' },
  { cidade: 'Porto Alegre', estado: 'RS' }, { cidade: 'Caxias do Sul', estado: 'RS' },
  { cidade: 'Gravataí', estado: 'RS' }, { cidade: 'Pelotas', estado: 'RS' },
  { cidade: 'Curitiba', estado: 'PR' }, { cidade: 'Londrina', estado: 'PR' },
  { cidade: 'Maringá', estado: 'PR' }, { cidade: 'Foz do Iguaçu', estado: 'PR' },
  { cidade: 'Salvador', estado: 'BA' }, { cidade: 'Feira de Santana', estado: 'BA' },
  { cidade: 'Vitória da Conquista', estado: 'BA' },
  { cidade: 'Recife', estado: 'PE' }, { cidade: 'Caruaru', estado: 'PE' },
  { cidade: 'Fortaleza', estado: 'CE' }, { cidade: 'Caucaia', estado: 'CE' },
  { cidade: 'Brasília', estado: 'DF' }, { cidade: 'Goiânia', estado: 'GO' },
  { cidade: 'Florianópolis', estado: 'SC' }, { cidade: 'Joinville', estado: 'SC' },
  { cidade: 'Manaus', estado: 'AM' }, { cidade: 'Belém', estado: 'PA' },
  { cidade: 'Fortaleza', estado: 'CE' }, { cidade: 'Natal', estado: 'RN' },
  { cidade: 'Maceió', estado: 'AL' }, { cidade: 'Aracaju', estado: 'SE' },
  { cidade: 'Campo Grande', estado: 'MS' }, { cidade: 'Cuiabá', estado: 'MT' },
  { cidade: 'Teresina', estado: 'PI' }, { cidade: 'São Luís', estado: 'MA' },
]

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomFloat(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 100) / 100 }
function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomCPF(): string {
  const digits = Array.from({ length: 9 }, () => randomInt(0, 9))
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i)
  let rem = (sum * 10) % 11
  digits.push(rem === 10 ? 0 : rem)
  sum = 0
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i)
  rem = (sum * 10) % 11
  digits.push(rem === 10 ? 0 : rem)
  return digits.join('')
}
function randomPhone(): string {
  const ddd = randomInt(11, 99)
  const num = String(randomInt(900000000, 999999999))
  return `(${ddd}) ${num.slice(0,5)}-${num.slice(5)}`
}
function randomCEP(): string {
  return String(randomInt(10000000, 99999999)).replace(/(\d{5})(\d{3})/, '$1-$2')
}

async function seed() {
  console.log('🗑️  Limpando dados existentes...')
  await db.movimentacaoEstoque.deleteMany()
  await db.itemVenda.deleteMany()
  await db.financeiro.deleteMany()
  await db.venda.deleteMany()
  await db.produto.deleteMany()
  await db.categoria.deleteMany()
  await db.cliente.deleteMany()

  console.log('📂 Criando categorias...')
  const catMap = new Map<string, string>()
  for (const cat of CATEGORIAS) {
    const created = await db.categoria.create({ data: cat })
    catMap.set(cat.nome, created.id)
    console.log(`  ✓ ${cat.nome}`)
  }

  console.log('\n📦 Criando produtos...')
  let codigoCounter: Record<string, number> = {}
  const CAT_PREFIXES: Record<string, string> = {
    'Notebooks': 'NB', 'Desktops': 'DT', 'Monitores': 'MNT', 'Teclados': 'TEC',
    'Mouses': 'MOU', 'Memória RAM': 'RAM', 'SSDs': 'SSD', 'HDs Externos': 'HDE',
    'Placas de Vídeo': 'GPU', 'Processadores': 'CPU', 'Placas-Mãe': 'MB',
    'Fontes de Alimentação': 'FON', 'Gabinetes': 'GAB', 'Impressoras': 'IMP',
    'Roteadores': 'ROT', 'Switches de Rede': 'SWT', 'Webcams': 'WBC',
    'Headsets': 'HST', 'Caixas de Som': 'SOM', 'Projetores': 'PRJ',
    'Nobreaks e UPS': 'NBR', 'Cabos e Conectores': 'CAB', 'Hubs USB': 'HUB',
    'Tablets': 'TAB', 'Smartphones': 'CEL', 'Smartwatches': 'WTC',
    'Câmeras de Segurança': 'CFT', 'Servidores': 'SRV', 'Licenças de Software': 'LIC',
    'Acessórios para Notebook': 'ACN', 'Coolers e Ventilação': 'COL', 'Pendrives': 'PEN',
    'Microfones': 'MIC', 'Estabilizadores': 'EST',
  }

  let totalProdutos = 0
  for (const group of PRODUCTS) {
    const catId = catMap.get(group.cat)!
    const prefix = CAT_PREFIXES[group.cat] || 'PRD'
    if (!codigoCounter[group.cat]) codigoCounter[group.cat] = 1

    for (const item of group.items) {
      const idx = codigoCounter[group.cat]++
      const codigo = `${prefix}${String(idx).padStart(3, '0')}`
      const estoqueAtual = randomInt(0, 150)
      const estoqueMinimo = randomInt(3, 15)
      const barras = String(randomInt(1000000000000, 9999999999999))

      await db.produto.create({
        data: {
          codigo,
          nome: item.nome,
          descricao: null,
          precoCusto: item.custo,
          precoVenda: item.venda,
          estoqueAtual,
          estoqueMinimo,
          categoriaId: catId,
          codigoBarras: barras,
          unidade: item.unidade,
          status: 'ATIVO',
        }
      })
      totalProdutos++
    }
    console.log(`  ✓ ${group.cat}: ${group.items.length} produtos`)
  }

  console.log('\n👥 Criando clientes...')
  let totalClientes = 0
  for (const nome of NOMES) {
    const loc = randomItem(CIDADES_ESTADOS)
    const email = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.').split('.')[0] + randomInt(1,99) + '@email.com'
    await db.cliente.create({
      data: {
        nome,
        cpf: randomCPF(),
        email,
        telefone: randomPhone(),
        celular: randomPhone(),
        dataNascimento: `${randomInt(1960, 2002)}-${String(randomInt(1,12)).padStart(2,'0')}-${String(randomInt(1,28)).padStart(2,'0')}`,
        cep: randomCEP(),
        logradouro: randomItem(LOGRADOUROS),
        numero: String(randomInt(1, 5000)),
        complemento: randomItem(['', 'Sala 101', 'Apto 42', 'Loja 3', '', '', 'Conjunto 12']),
        bairro: randomItem(BAIRROS),
        cidade: loc.cidade,
        estado: loc.estado,
        status: Math.random() > 0.1 ? 'ATIVO' : 'INATIVO',
        limiteCredito: randomFloat(500, 15000),
      }
    })
    totalClientes++
  }
  console.log(`  ✓ ${totalClientes} clientes criados`)

  console.log('\n🛒 Criando vendas de exemplo...')
  const allProdutos = await db.produto.findMany({ where: { status: 'ATIVO', estoqueAtual: { gt: 0 } } })
  const allClientes = await db.cliente.findMany({ where: { status: 'ATIVO' } })
  const formas = ['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO']
  let totalVendas = 0

  for (let v = 0; v < 40; v++) {
    const numItens = randomInt(1, 5)
    const shuffled = [...allProdutos].sort(() => Math.random() - 0.5)
    const itens = shuffled.slice(0, numItens)
    const cliente = Math.random() > 0.2 ? randomItem(allClientes) : null
    const forma = randomItem(formas)
    const daysAgo = randomInt(0, 30)
    const dataVenda = new Date()
    dataVenda.setDate(dataVenda.getDate() - daysAgo)
    dataVenda.setHours(randomInt(8, 20), randomInt(0, 59), randomInt(0, 59))

    const subtotal = itens.reduce((s, p) => s + p.precoVenda * randomInt(1, 3), 0)
    const desconto = Math.random() > 0.7 ? randomFloat(5, 50) : 0
    const total = Math.max(0, subtotal - desconto)
    const numero = `V${String(v + 1).padStart(5, '0')}`

    const venda = await db.venda.create({
      data: {
        numero,
        clienteId: cliente?.id,
        dataVenda,
        subtotal,
        desconto,
        total,
        formaPagamento: forma,
        status: 'CONCLUIDA',
      }
    })

    for (const produto of itens) {
      const qty = randomInt(1, 3)
      const precoUnit = produto.precoVenda
      await db.itemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: produto.id,
          quantidade: qty,
          precoUnitario: precoUnit,
          subtotal: precoUnit * qty,
        }
      })
      // Update stock
      await db.produto.update({ where: { id: produto.id }, data: { estoqueAtual: { decrement: qty } } })
      await db.movimentacaoEstoque.create({
        data: {
          produtoId: produto.id,
          tipo: 'SAIDA',
          quantidade: qty,
          estoqueAntes: produto.estoqueAtual,
          estoqueDepois: Math.max(0, produto.estoqueAtual - qty),
          motivo: `Venda #${numero}`,
        }
      })
    }

    // Financial entry
    const isReceber = forma === 'BOLETO' || forma === 'CARTAO_CREDITO'
    if (isReceber) {
      const venc = new Date(dataVenda)
      venc.setDate(venc.getDate() + (forma === 'BOLETO' ? 30 : 15))
      const pago = Math.random() > 0.3
      await db.financeiro.create({
        data: {
          clienteId: cliente?.id,
          tipo: 'RECEBER',
          descricao: `Venda #${numero}`,
          valor: total,
          dataVencimento: venc.toISOString().slice(0, 10),
          dataPagamento: pago ? dataVenda.toISOString().slice(0, 10) : null,
          status: pago ? 'PAGO' : (venc < new Date() ? 'ATRASADO' : 'PENDENTE'),
          formaPagamento: pago ? forma : null,
          vendaId: venda.id,
        }
      })
    }

    totalVendas++
  }
  console.log(`  ✓ ${totalVendas} vendas criadas com movimentações e registros financeiros`)

  // Count final
  const finalProdutos = await db.produto.count()
  const finalClientes = await db.cliente.count()
  const finalVendas = await db.venda.count()

  console.log('\n✅ Seed concluído com sucesso!')
  console.log(`   📦 ${finalProdutos} produtos em ${CATEGORIAS.length} categorias`)
  console.log(`   👥 ${finalClientes} clientes`)
  console.log(`   🛒 ${finalVendas} vendas`)
}

seed()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1) })
  .finally(() => db.$disconnect())