# Freitas ERP — Plano de entrega

## Fase 0 — Laboratório (esta branch)
- [x] Revisão do protótipo existente e identificação de limites
- [x] Interface SaaS Next.js isolada do aplicativo original
- [x] Demonstração com dados fictícios e navegação por módulos
- [x] Estruturas SQL para banco central + banco dedicado por empresa
- [x] APIs de autenticação, controles de acesso e CRUD operacional
- [x] Comandas com serviços, estados, inspeções, caixa, estoque e registro manual de recebimento
- [x] Viewer 3D integrado à tela de vistorias
- [ ] Repositório GitHub privado exclusivo
- [ ] CI de testes, revisão e integração Git automática com Vercel
- [ ] Banco Neon de homologação e provisionamento de primeira empresa
- [ ] Testes completos E2E em navegador, celular e recuperação de falhas

## Fase 1 — Confiabilidade
- [ ] Testes de autorização por função e acesso cruzado a bancos
- [ ] Autenticação MFA, recuperação de senha e convites com token único
- [ ] Sessões revogáveis, proteção IP e rate-limit distribuído
- [ ] Backup automático validado com teste de restauração
- [ ] Alertas, rastreamento de erros e trilha de alterações de dados
- [ ] Estruturar migrações por versão usando ferramenta revisada

## Fase 2 — Vistoria profissional
- [ ] Modelos GLB próprios/licenciados por classe de veículo e versionamento semântico
- [ ] Fotos antes/depois com S3/R2 privado, assinaturas URL com prazo curto, checksum SHA-256
- [ ] Consentimento, confirmação de cliente e assinatura com trilha de evidência
- [ ] Relatório PDF profissional, exportação e evidências imutáveis logicamente
- [ ] Fallback 2D e testes de performance em Android/iPhone

## Fase 3 — Operações e gestão
- [ ] Balanço/estorno financeiro e conciliação auditável
- [ ] Inventário, compras, consumo por serviço e alertas
- [ ] Comissões, turnos, escalas e produtividade
- [ ] Múltiplas unidades por empresa e consolidação sem cruzar clientes
- [ ] CRM, lembretes opt-in e fidelização
- [ ] Relatórios DRE gerencial, custos por serviço e exportação Excel/PDF
- [ ] Integrações fiscais apenas após validação com contador

## Fase 4 — SaaS comercial
- [ ] Cadastro público com validação de e-mail/CNPJ, rate limiting e prevenção de duplicidades
- [ ] Provisionamento automático seguro de banco por empresa e rollback compensatório
- [ ] Assinaturas em Stripe exclusiva Freitas Corp (não vincular à Ducha Elitte)
- [ ] Painel central de planos, inadimplência, limites e suporte
- [ ] Observabilidade, LGPD, termos, políticas, incident response, SLA
- [ ] Pilotos autorizados, homologação formal e liberação comercial

**Bloqueio de release:** não habilitar empresas reais antes de validar todos os controles de segurança e isolamento.
