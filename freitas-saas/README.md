# Freitas ERP — Gestão de Lava-Rápidos

**Software da Freitas Corp. Independente da Ducha Elitte / AquaFlow.**

Status: **laboratório / homologação**, não habilitado para uso comercial nem com dados reais.

## O que este código já contém
- Interface Next.js / React / TypeScript responsiva, com navegação por módulos.
- Demonstração funcional fictícia no navegador, com cadastros e comandas locais.
- Login HTTP-only com JWT assinado e hash bcrypt (exige bancos configurados).
- Banco central de identidade e catálogo de empresas, separado dos bancos operacionais.
- Conexões de bancos dos lava-rápidos criptografadas no banco central com AES-256-GCM.
- Verificação da associação usuário/empresa e permissões a cada chamada.
- API de clientes, veículos, serviços, agenda, equipe, produtos/estoque.
- API transacional de comandas, fluxo de etapas, inspeção e ocorrência auditável.
- Caixa, movimentação de estoque e registro de recebimento manual com proteção de repetição.
- Painel com valor **realmente registrado** no caixa separado do total previsto.
- Vistoria 3D procedural com seleção de peças, coordenadas e fallback textual.
- SQL de criação de bancos, script de provisionamento e testes de fluxo de comandas.

## O que ainda NÃO está pronto
- Repositório GitHub privado exclusivo (este diretório está em branch isolada do ERP-TECH apenas para preparo).
- Banco Neon de homologação e usuários reais configurados.
- Fotos e armazenamento privado S3/R2, antivírus, assinatura eletrônica e PDF profissional.
- Conciliação com adquirentes, cobranças automáticas, Stripe Connect e emissão fiscal.
- Provisionamento automático de N empresas, painel administrativo SaaS e cobrança recorrente.
- Testes E2E mobile, performance, segurança, restauração de backups e aprovações de release.

## Execução local
```bash
npm install
cp .env.example .env.local
# Para navegar na demonstração, configure NEXT_PUBLIC_DEMO_MODE=true
npm run dev
npm test
npm run build
```

## Banco real (somente homologação)
1. Criar um PostgreSQL CENTRAL exclusivo do Freitas ERP.
2. Criar outro projeto/banco Neon EXCLUSIVO para cada lava-rápido de testes.
3. Executar `database/central.sql` no central; `database/tenant.sql` e `database/002_idempotency.sql` em cada banco de empresa.
4. Gerar uma chave aleatória de 32 bytes hexadecimais para `MASTER_ENCRYPTION_KEY` e segredo independente para `SESSION_SECRET`; guardar no cofre da Vercel, nunca no GitHub ou mensagens.
5. Em ambiente local controlado, executar `node scripts/enroll-tenant.mjs` com as variáveis obrigatórias. O administrador receberá acesso apenas à empresa cadastrada.
6. Desabilitar `NEXT_PUBLIC_DEMO_MODE` para testar rotas reais, validar isolamento e preservar proteção da Vercel.

## Escopo e controles
- **Nunca** utilizar banco, API, domínio, Stripe, secrets, usuários ou dados da Ducha Elitte.
- No laboratório, nenhuma compra, pagamento real ou emissão fiscal é realizada.
- A operação de caixa `pix_confirmed`/`card_confirmed` registra confirmação recebida por outro meio; não processa nem verifica transações com instituições financeiras.
- Acesso de apresentação não é acesso a dados reais; não inserir dados pessoais na demonstração local.
- Estar publicado com status READY na Vercel não comprova homologação.

## Migração ao repositório exclusivo
Criar **privado** `Raphaeljdk/freitas-erp-saas` no GitHub e então migrar esta pasta para a raiz do novo repositório (sem o restante de ERP-TECH); configurar a Vercel para `main` e previews de PR. Antes da integração contínua, proteger branch principal e ativar revisão/testes obrigatórios. Consulte `docs/ROADMAP.md`.
