# Freitas ERP Lab — Comandas + Vistoria 3D (Beta)

Protótipo **independente**, destinado a avaliar uma experiência de comandas com vistoria tridimensional. Não há integração com a Ducha Elitte, bancos Neon, pagamentos, clientes reais ou autenticação.

## O que funciona
- Dashboard de demonstração com indicadores e comandas.
- Cadastro de comandas com cliente, placa, veículo, serviço, preço e status.
- Carro 3D procedural em Three.js, com rotação, zoom, seleção de peças e marcadores visuais.
- Registro e remoção de ocorrências por peça, tipo e observação.
- Checklist por comanda.
- Evolução de status do atendimento.
- Impressão de relatório de vistoria e exportação JSON.
- Layout responsivo para desktop e celular.

## Como testar
Abra index.html em um servidor HTTP local (por exemplo, python3 -m http.server 8080 dentro desta pasta). É necessário internet no navegador para carregar Three.js pelo CDN. O projeto também pode ser hospedado como site estático na Vercel.

## Limitações importantes
**Não usar dados reais em produção.** Os dados são de exemplo e persistem apenas no localStorage do navegador. O modelo 3D é **genérico e estilizado**, sem garantia de corresponder a uma marca/modelo real. Não há autenticação, controle de acesso, trilha de auditoria, armazenamento persistente de fotos, isolamento multiempresa, transações financeiras nem backup remoto. O PDF é fornecido pela função Imprimir do navegador.

## Próxima fase
- Migrar para aplicação TypeScript/React modular.
- Persistência em PostgreSQL e armazenamento de fotos.
- Autenticação, perfis e trilha auditável.
- Modelos GLB próprios e otimização mobile.
- Testes de integração, acessibilidade e desempenho antes de oferecer a clientes.

Este experimento não substitui um laudo técnico, nem valida danos automaticamente.
