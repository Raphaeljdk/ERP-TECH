import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const EXTRA_PRODUCTS: { cat: string; items: { nome: string; custo: number; venda: number; unidade: string }[] }[] = [
  { cat: 'Notebooks', items: [
    { nome: 'Notebook Dell Vostro 3520 i3-1225U 4GB 256GB SSD', custo: 2300, venda: 2999, unidade: 'UN' },
    { nome: 'Notebook Lenovo IdeaPad 3 15.6" Ryzen 5 5500U 8GB 256GB', custo: 2500, venda: 3199, unidade: 'UN' },
    { nome: 'Notebook HP 15s Ryzen 5 5500U 8GB 256GB SSD', custo: 2600, venda: 3299, unidade: 'UN' },
    { nome: 'Notebook Asus Vivobook 15 Ryzen 5 5600H 8GB 512GB SSD', custo: 2900, venda: 3699, unidade: 'UN' },
    { nome: 'Notebook Acer Aspire 3 Ryzen 3 5300U 4GB 256GB SSD', custo: 2100, venda: 2799, unidade: 'UN' },
    { nome: 'Notebook Samsung Galaxy Book2 15.6" i5 8GB 256GB', custo: 3000, venda: 3899, unidade: 'UN' },
    { nome: 'Notebook Dell G15 5520 i5-12500H RTX 3050 8GB', custo: 4800, venda: 6199, unidade: 'UN' },
    { nome: 'Notebook Lenovo Legion 5 Pro i7-12700H RTX 3070 Ti 16GB', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Notebook HP Victus 16 i5-12500H RTX 3050 8GB', custo: 4600, venda: 5899, unidade: 'UN' },
    { nome: 'Notebook MacBook Air 15 M2 8GB 256GB SSD', custo: 9200, venda: 11999, unidade: 'UN' },
    { nome: 'Notebook Apple MacBook Pro 14 M3 8GB 512GB SSD', custo: 13000, venda: 16999, unidade: 'UN' },
    { nome: 'Notebook LG Gram 17 i7-1260P 16GB 512GB SSD', custo: 6500, venda: 8499, unidade: 'UN' },
    { nome: 'Notebook MSI Bravo 15 Ryzen 5 5600H RTX 3050 8GB', custo: 4200, venda: 5499, unidade: 'UN' },
    { nome: 'Notebook Alienware m15 R7 i7-12700H RTX 3070 Ti 16GB', custo: 12000, venda: 15499, unidade: 'UN' },
    { nome: 'Notebook Razer Blade 15 i7-12800H RTX 3070 Ti 16GB', custo: 13000, venda: 16999, unidade: 'UN' },
    { nome: 'Notebook Samsung Galaxy Book3 Pro 360 i7 16GB 1TB', custo: 7500, venda: 9699, unidade: 'UN' },
    { nome: 'Notebook Dell Precision 5480 i7-1380P 32GB 512GB', custo: 11000, venda: 14499, unidade: 'UN' },
    { nome: 'Notebook Lenovo ThinkPad P14s i7-1360P 16GB 512GB', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Notebook HP ZBook Firefly 14 G10 i7-1360P 32GB 1TB', custo: 9500, venda: 12499, unidade: 'UN' },
    { nome: 'Notebook Acer Swift Go 14 i5-1340P 16GB 512GB OLED', custo: 4200, venda: 5499, unidade: 'UN' },
  ]},
  { cat: 'Monitores', items: [
    { nome: 'Monitor LG UltraWide 29WN600-W 29" UW-FHD IPS', custo: 1500, venda: 1999, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey G9 49" DQHD 240Hz', custo: 8500, venda: 10999, unidade: 'UN' },
    { nome: 'Monitor Dell G2723HN 27" Full HD 165Hz IPS', custo: 1400, venda: 1849, unidade: 'UN' },
    { nome: 'Monitor Philips 272E2FAE 27" Full HD IPS', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Monitor AOC Q27G3XMN 27" QHD 165Hz MiniLED', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'Monitor Gigabyte M27Q 27" QHD 170Hz IPS', custo: 1600, venda: 2099, unidade: 'UN' },
    { nome: 'Monitor Acer Nitro XV272U Vbmiiprx 27" QHD 180Hz', custo: 1900, venda: 2499, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey G3 24" Full HD 144Hz VA', custo: 1000, venda: 1349, unidade: 'UN' },
    { nome: 'Monitor LG 27GR83Q-B 27" QHD 240Hz IPS', custo: 2500, venda: 3299, unidade: 'UN' },
    { nome: 'Monitor Asus TUF Gaming VG28UQL1A 28" 4K 144Hz', custo: 3800, venda: 4999, unidade: 'UN' },
    { nome: 'Monitor Dell S2722QC 27" QHD USB-C IPS', custo: 2000, venda: 2599, unidade: 'UN' },
    { nome: 'Monitor HP Omen 27q 27" QHD 165Hz IPS', custo: 1900, venda: 2499, unidade: 'UN' },
    { nome: 'Monitor BenQ MOBIUZ EX2710S 27" Full HD 165Hz', custo: 1200, venda: 1599, unidade: 'UN' },
    { nome: 'Monitor Samsung Odyssey Ark 55" 4K 165Hz', custo: 18000, venda: 22999, unidade: 'UN' },
    { nome: 'Monitor LG 32UN880-B 32" 4K USB-C IPS HDR', custo: 3500, venda: 4599, unidade: 'UN' },
    { nome: 'Monitor AOC Agon AG274QXM 27" QHD 240Hz MiniLED', custo: 2800, venda: 3699, unidade: 'UN' },
    { nome: 'Monitor Dell U3223QE 32" 4K USB-C IPS Black', custo: 3500, venda: 4499, unidade: 'UN' },
    { nome: 'Monitor Acer Predator X34S 34" UWQHD 180Hz', custo: 4200, venda: 5499, unidade: 'UN' },
    { nome: 'Monitor Philips Evnia 27M2N6800ML 27" QHD 280Hz', custo: 3000, venda: 3899, unidade: 'UN' },
    { nome: 'Monitor Redmagic 4K Gaming Monitor 27" 160Hz', custo: 3200, venda: 4199, unidade: 'UN' },
  ]},
  { cat: 'Placas de Vídeo', items: [
    { nome: 'RTX 4060 Ti 8GB ZOTAC Twin Edge', custo: 2300, venda: 3099, unidade: 'UN' },
    { nome: 'RTX 4060 8GB MSI Ventus 2X OC', custo: 1700, venda: 2299, unidade: 'UN' },
    { nome: 'RTX 4070 12GB Gigabyte Windforce OC', custo: 3100, venda: 4099, unidade: 'UN' },
    { nome: 'RTX 4070 Super 12GB ZOTAC Trinity OC', custo: 3500, venda: 4599, unidade: 'UN' },
    { nome: 'RTX 4070 Ti 16GB PNY Verto Dual Fan', custo: 4100, venda: 5399, unidade: 'UN' },
    { nome: 'RTX 4080 16GB ASUS TUF Gaming OC', custo: 5600, venda: 7299, unidade: 'UN' },
    { nome: 'RX 7600 8GB Sapphire Pulse ITX', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'RX 6650 XT 8GB XFX Speedster SWFT 210', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'RX 6700 XT 12GB MSI Mech 2X', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'RX 7800 XT 16GB PowerColor Hellhound', custo: 2700, venda: 3599, unidade: 'UN' },
    { nome: 'RTX 3060 Ti 8GB GIGABYTE Gaming OC', custo: 1600, venda: 2099, unidade: 'UN' },
    { nome: 'RTX 4070 Ti Super 16GB INNO3D iChill X4', custo: 4300, venda: 5699, unidade: 'UN' },
    { nome: 'RX 7900 GRE 16GB ASRock Phantom Gaming', custo: 3200, venda: 4199, unidade: 'UN' },
    { nome: 'RTX 4090 24GB Gigabyte Windforce', custo: 10500, venda: 13499, unidade: 'UN' },
    { nome: 'RTX 4060 8GB Palit Dual OC', custo: 1700, venda: 2249, unidade: 'UN' },
    { nome: 'RTX 4070 Super 12GB Palit DUAL', custo: 3400, venda: 4499, unidade: 'UN' },
    { nome: 'RX 6750 XT 12GB Yeston Radeon', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'RTX 3070 Ti 8GB ASUS Dual OC', custo: 2000, venda: 2599, unidade: 'UN' },
    { nome: 'RX 7600 XT 16GB Yeston GameAce', custo: 1700, venda: 2249, unidade: 'UN' },
    { nome: 'RTX 4080 Super 16GB Gigabyte Gaming OC', custo: 6000, venda: 7799, unidade: 'UN' },
  ]},
  { cat: 'SSDs', items: [
    { nome: 'SSD Kingston NV2 4TB NVMe M.2', custo: 1000, venda: 1349, unidade: 'UN' },
    { nome: 'SSD Samsung 870 EVO 4TB SATA', custo: 1400, venda: 1899, unidade: 'UN' },
    { nome: 'SSD WD Black SN770 1TB NVMe Gen4', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'SSD WD Black SN770 2TB NVMe Gen4', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'SSD Kingston KC3000 1TB NVMe Gen4', custo: 520, venda: 749, unidade: 'UN' },
    { nome: 'SSD ADATA XPG S70 Blade 1TB NVMe Gen4', custo: 480, venda: 669, unidade: 'UN' },
    { nome: 'SSD ADATA XPG S70 Blade 2TB NVMe Gen4', custo: 880, venda: 1199, unidade: 'UN' },
    { nome: 'SSD Samsung 970 EVO Plus 1TB NVMe', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'SSD Samsung 970 EVO Plus 2TB NVMe', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'SSD Crucial P5 Plus 1TB NVMe Gen4', custo: 450, venda: 629, unidade: 'UN' },
    { nome: 'SSD TeamGroup MP44 1TB NVMe Gen4', custo: 400, venda: 569, unidade: 'UN' },
    { nome: 'SSD Corsair MP600 GS 1TB NVMe Gen4', custo: 460, venda: 649, unidade: 'UN' },
    { nome: 'SSD Kingston A2000 250GB NVMe', custo: 120, venda: 189, unidade: 'UN' },
    { nome: 'SSD WD Blue SN570 1TB NVMe Gen3', custo: 340, venda: 479, unidade: 'UN' },
    { nome: 'SSD Samsung 980 Pro 4TB NVMe Gen4', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'SSD WD Black SN850X 4TB NVMe Gen4', custo: 2000, venda: 2699, unidade: 'UN' },
    { nome: 'SSD Crucial T700 2TB NVMe Gen5', custo: 2200, venda: 2999, unidade: 'UN' },
    { nome: 'SSD Kingston FURY Renegade 2TB NVMe Gen4', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'SSD Seagate FireCuda 530 1TB NVMe Gen4', custo: 580, venda: 799, unidade: 'UN' },
    { nome: 'SSD PNY CS3140 2TB NVMe Gen4', custo: 950, venda: 1299, unidade: 'UN' },
  ]},
  { cat: 'Memória RAM', items: [
    { nome: 'Memória DDR4 Kingston ValueRAM 4GB 2666MHz', custo: 80, venda: 129, unidade: 'UN' },
    { nome: 'Memória DDR4 Corsair Vengeance LPX 8GB 3200MHz Black', custo: 180, venda: 269, unidade: 'UN' },
    { nome: 'Memória DDR5 Corsair Vengeance 64GB 5600MHz', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Memória DDR5 G.Skill Trident Z5 RGB 16GB 6400MHz', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Memória DDR5 ADATA XPG Lancer 32GB 6000MHz', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Memória DDR4 XPG Spectrix D41 16GB 3200MHz RGB', custo: 300, venda: 429, unidade: 'UN' },
    { nome: 'Memória DDR5 G.Skill Trident Z5 RGB 64GB 6400MHz', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Memória DDR4 Crucial Pro 32GB 3200MHz', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Memória DDR5 Kingston Fury Beast 8GB 5200MHz', custo: 220, venda: 329, unidade: 'UN' },
    { nome: 'Memória DDR5 Corsair Vengeance RGB 32GB 6000MHz', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Memória DDR4 HyperX Predator 16GB 3600MHz RGB', custo: 380, venda: 529, unidade: 'UN' },
    { nome: 'Memória DDR5 G.Skill Flare X5 32GB 6000MHz AMD', custo: 720, venda: 999, unidade: 'UN' },
    { nome: 'Memória DDR4 PNY XLR8 Gaming 16GB 3200MHz', custo: 260, venda: 379, unidade: 'UN' },
    { nome: 'Memória DDR5 ADATA Lancer Blade 16GB 6000MHz', custo: 380, venda: 529, unidade: 'UN' },
    { nome: 'Memória DDR4 Kingston FURY Beast 8GB 3200MHz RGB', custo: 220, venda: 329, unidade: 'UN' },
    { nome: 'Memória DDR5 Crucial Pro 64GB 5600MHz', custo: 1300, venda: 1799, unidade: 'UN' },
    { nome: 'Memória DDR4 G.Skill Ripjaws V 16GB 3000MHz', custo: 250, venda: 359, unidade: 'UN' },
    { nome: 'Memória DDR5 Corsair Dominator Platinum 32GB 6000MHz', custo: 1100, venda: 1499, unidade: 'UN' },
    { nome: 'Memória Notebook DDR5 Kingston 16GB 4800MHz', custo: 300, venda: 429, unidade: 'UN' },
  ]},
  { cat: 'Processadores', items: [
    { nome: 'Intel Core i3-14100F 3.5GHz LGA1700', custo: 650, venda: 849, unidade: 'UN' },
    { nome: 'Intel Core i5-14500 2.6GHz LGA1700', custo: 1300, venda: 1749, unidade: 'UN' },
    { nome: 'Intel Core i9-13900KF 3.0GHz LGA1700', custo: 2700, venda: 3599, unidade: 'UN' },
    { nome: 'Intel Core i7-14700KF 3.4GHz LGA1700', custo: 2300, venda: 3099, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 5600 3.5GHz AM4', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'AMD Ryzen 7 5700X 3.4GHz AM4', custo: 1000, venda: 1399, unidade: 'UN' },
    { nome: 'AMD Ryzen 9 5900X 3.7GHz AM4', custo: 1500, venda: 2049, unidade: 'UN' },
    { nome: 'AMD Ryzen 5 7600 3.8GHz AM5', custo: 950, venda: 1349, unidade: 'UN' },
    { nome: 'AMD Ryzen 9 7950X3D 4.2GHz AM5', custo: 3200, venda: 4299, unidade: 'UN' },
    { nome: 'AMD Ryzen 7 5800X3D 4.2GHz AM4', custo: 1500, venda: 2049, unidade: 'UN' },
  ]},
  { cat: 'Roteadores', items: [
    { nome: 'Roteador TP-Link Archer AX72 AX5400', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Roteador TP-Link Deco X50 Mesh Wi-Fi 6 3-pack', custo: 900, venda: 1249, unidade: 'UN' },
    { nome: 'Roteador D-Link DIR-X1860 AX1800', custo: 300, venda: 429, unidade: 'UN' },
    { nome: 'Roteador Asus RT-AX59U AX3000', custo: 420, venda: 599, unidade: 'UN' },
    { nome: 'Roteador Netgear RAX70 AX5400', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Roteador Xiaomi Router AX3200', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Roteador TP-Link Deco M4 AC1200 Mesh 3-pack', custo: 550, venda: 799, unidade: 'UN' },
    { nome: 'Roteador Intelbras Wi-Fi 6 AX1800', custo: 220, venda: 349, unidade: 'UN' },
    { nome: 'Roteador Multilaser RE053 Repetidor Wi-Fi', custo: 60, venda: 99, unidade: 'UN' },
    { nome: 'Roteador TP-Link RE500X Repetidor Wi-Fi 6', custo: 200, venda: 299, unidade: 'UN' },
  ]},
  { cat: 'Headsets', items: [
    { nome: 'Headset Logitech G Astro A30 Wireless', custo: 750, venda: 999, unidade: 'UN' },
    { nome: 'Headset SteelSeries Arctis Nova Pro Wireless', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Headset HyperX Cloud III Wireless DTS:X', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Headset Razer BlackShark V2 Pro 2023 Wireless', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Headset Corsair Virtuoso RGB Wireless XT', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Headset JBL Tune 770NC ANC Bluetooth', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Headset Sennheiser HD 206 Over-Ear', custo: 200, venda: 299, unidade: 'UN' },
    { nome: 'Headset Audio-Technica ATH-M50x Studio', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Headset Beyerdynamic DT 770 Pro 80 Ohm', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Headset AKG K240 Studio Semi-Open', custo: 350, venda: 499, unidade: 'UN' },
  ]},
  { cat: 'Teclados', items: [
    { nome: 'Teclado Mecânico Logitech G715 Wireless', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Teclado Mecânico Corsair K65 PRO MINI RGB', custo: 550, venda: 749, unidade: 'UN' },
    { nome: 'Teclado Mecânico Razer BlackWidow V4 75%', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Teclado Mecânico Womier K66 Wireless RGB', custo: 200, venda: 329, unidade: 'UN' },
    { nome: 'Teclado Mecânico Epomaker TH66 Wireless', custo: 250, venda: 399, unidade: 'UN' },
    { nome: 'Teclado Mecânico Keychron Q0 HE Wireless', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Teclado Logitech K120 USB', custo: 40, venda: 69, unidade: 'UN' },
    { nome: 'Teclado Mecânico Redragon K606 Visnu', custo: 150, venda: 239, unidade: 'UN' },
    { nome: 'Teclado Mecânico ASUS ROG Strix Scope II 96', custo: 650, venda: 899, unidade: 'UN' },
    { nome: 'Teclado Mecânico Glorious GMMK Pro 65%', custo: 500, venda: 699, unidade: 'UN' },
  ]},
  { cat: 'Mouses', items: [
    { nome: 'Mouse Logitech G502 HERO Wired', custo: 300, venda: 429, unidade: 'UN' },
    { nome: 'Mouse Razer DeathAdder V2 HyperSpeed', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Mouse Corsair M65 PRO RGB', custo: 280, venda: 399, unidade: 'UN' },
    { nome: 'Mouse Zowie EC1-CW Large', custo: 450, venda: 629, unidade: 'UN' },
    { nome: 'Mouse Endgame Gear OP1we Wireless', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Mouse Pulsar X2 V3 Mini Wireless', custo: 350, venda: 499, unidade: 'UN' },
    { nome: 'Mouse Vaxee Outset AX Wireless', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Mouse Lamzu Atlantis Mini Wireless', custo: 380, venda: 549, unidade: 'UN' },
    { nome: 'Mouse Logitech G304 Lightspeed', custo: 150, venda: 229, unidade: 'UN' },
    { nome: 'Mouse Microsoft Bluetooth Mouse 3600', custo: 100, venda: 169, unidade: 'UN' },
  ]},
  { cat: 'Câmeras de Segurança', items: [
    { nome: 'Câmera IP Wi-Fi 3MP Intelbras VIP 5830 B', custo: 250, venda: 399, unidade: 'UN' },
    { nome: 'Câmera IP PoE 8MP Hikvision DS-2CD2T87G2', custo: 600, venda: 899, unidade: 'UN' },
    { nome: 'Câmera Bullet 4MP Dahua IPC-HFW2831T', custo: 550, venda: 829, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi TP-Link Tapo C520WS Exterior', custo: 320, venda: 499, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi Xiaomi C300 2K', custo: 180, venda: 289, unidade: 'UN' },
    { nome: 'DVR 8 Canais 4K Hikvision DS-7208HQHI-K1', custo: 700, venda: 999, unidade: 'UN' },
    { nome: 'Câmera IP Wi-Fi 1080p Imou Cruiser', custo: 170, venda: 279, unidade: 'UN' },
    { nome: 'Câmera IP Dome 2MP Dahua IPC-HDW2431T', custo: 320, venda: 499, unidade: 'UN' },
    { nome: 'Kit 8 Câmeras PoE 4MP Hikvision + NVR 8CH', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Câmera Wi-Fi Externa TP-Link Tapo C325WB', custo: 350, venda: 549, unidade: 'UN' },
  ]},
  { cat: 'Impressoras', items: [
    { nome: 'Impressora HP LaserJet M111w Mono Wi-Fi', custo: 800, venda: 1099, unidade: 'UN' },
    { nome: 'Impressora Canon imageRUNNER 2425 Multifuncional', custo: 4500, venda: 5999, unidade: 'UN' },
    { nome: 'Impressora Epson EcoTank L6290 Color Wi-Fi', custo: 1800, venda: 2499, unidade: 'UN' },
    { nome: 'Impressora HP Color LaserJet Pro M255dw', custo: 2200, venda: 2899, unidade: 'UN' },
    { nome: 'Impressora Brother MFC-L2820DW Laser Mono Wi-Fi', custo: 1200, venda: 1649, unidade: 'UN' },
    { nome: 'Impressora Canon SELPHY CP1500 Foto', custo: 500, venda: 699, unidade: 'UN' },
    { nome: 'Impressora HP DeskJet 4155e All-in-One', custo: 450, venda: 649, unidade: 'UN' },
    { nome: 'Impressora Epson Expression Home XP-4100', custo: 400, venda: 579, unidade: 'UN' },
    { nome: 'Impressora Zebra ZD421t Térmica USB', custo: 1800, venda: 2399, unidade: 'UN' },
    { nome: 'Impressora Elgin i9 Térmica 80mm', custo: 350, venda: 499, unidade: 'UN' },
  ]},
]

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

async function seed() {
  const cats = await db.categoria.findMany()
  const catMap = new Map(cats.map(c => [c.nome, c.id]))

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

  // Get current max codes per category
  const existing = await db.produto.findMany({ select: { codigo: true } })
  const codeCounters: Record<string, number> = {}
  for (const p of existing) {
    const prefix = p.codigo.replace(/\d+/, '')
    const num = parseInt(p.codigo.replace(/\D+/, ''))
    if (!codeCounters[prefix] || num > codeCounters[prefix]) codeCounters[prefix] = num
  }

  console.log('📦 Adicionando mais produtos...')
  let total = 0
  for (const group of EXTRA_PRODUCTS) {
    const catId = catMap.get(group.cat)
    if (!catId) { console.log(`  ⚠ Categoria "${group.cat}" não encontrada`); continue }
    const prefix = CAT_PREFIXES[group.cat] || 'PRD'
    let counter = codeCounters[prefix] || 0

    for (const item of group.items) {
      counter++
      const codigo = `${prefix}${String(counter).padStart(3, '0')}`
      const estoqueAtual = randomInt(0, 150)
      const estoqueMinimo = randomInt(3, 15)
      const barras = String(randomInt(1000000000000, 9999999999999))

      await db.produto.create({
        data: {
          codigo, nome: item.nome, descricao: null,
          precoCusto: item.custo, precoVenda: item.venda,
          estoqueAtual, estoqueMinimo, categoriaId: catId,
          codigoBarras: barras, unidade: item.unidade, status: 'ATIVO',
        }
      })
      total++
    }
    console.log(`  ✓ ${group.cat}: +${group.items.length}`)
  }

  const finalCount = await db.produto.count()
  console.log(`\n✅ Adicionados ${total} produtos. Total: ${finalCount}`)
}

seed().catch(e => { console.error('❌', e); process.exit(1) }).finally(() => db.$disconnect())