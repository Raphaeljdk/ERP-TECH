# Backlog aprovado para análise — 04/11/2026

## Limite de escopo
Este documento pertence ao laboratório independente **Freitas ERP SaaS**. Não executar deploy, migração, configuração ou alterações em **Ducha Elitte/AquaFlow** por consequência deste backlog. Os itens 14–16 fazem referência explícita à Ducha Elitte e exigem execução separada no projeto correto, mediante autorização.

## A. Operação — prioridade alta
- [ ] **Vistoria PDF visual:** gerar PDF com captura fiel do veículo na orientação da tela e marcações de avarias, legenda por peça, tipo, gravidade, data, operador e comanda; manter exportação legível mesmo sem WebGL, evitar vazamento de dados e preservar o original.
- [ ] **Reutilizar veículos:** buscar por placa normalizada e vínculo com cliente, selecionar veículo existente ao abrir nova comanda, impedir duplicidade e preservar histórico por atendimento.
- [ ] **Correção cadastral/cancelamento:** editar tipo de veículo com motivo, autor e histórico de antes/depois; cancelamento de comanda/veículo com motivo obrigatório, sem exclusão física, bloqueando registros indevidos e revertendo reservas/estoque/pagamentos conforme política transacional.
- [ ] **Cronômetro:** armazenar opened_at e ready_at no servidor; calcular duração na interface, sem depender de timer persistido; não reiniciar em refresh, considerar pausa/cancelamento e fuso horário.
- [ ] **Duração de serviços:** tempo previsto configurável em minutos por serviço; congelar previsão na linha da comanda; exibir previsto x real e atrasos.
- [ ] **Recebimentos:** separar dinheiro, Pix, débito e crédito; permitir parcelas/taxas/estornos e identificação da transação; não marcar cartão/Pix como confirmado sem conciliação ou confirmação externa auditável.

## B. Produtos e produtividade — prioridade alta
- [ ] **Catálogo de produtos independente:** bebidas, alimentos e outros; SKU, categoria, preço, custo, estoque, ativo/inativo, unidade, validade opcional e permissões.
- [ ] **Venda na comanda:** múltiplas linhas de serviço e produto com quantidade, preço capturado no momento da venda, descontos autorizados, reserva/baixa de estoque transacional, devolução e cancelamento auditável; nunca permitir estoque negativo sem autorização explícita.
- [ ] **Produtividade:** veículos concluídos, tempo médio e mediano entre abertura e pronto, tempo por serviço/profissional/unidade, atrasos, receita e custos, por período; excluir cancelados de métricas de conclusão.
- [ ] **Exportação:** CSV UTF-8 e XLSX, filtros por datas e permissões, totais reconciliáveis, proteção contra CSV formula injection e trilha de exportação.

## C. Comercial e plataforma — projeto correto a confirmar
- [ ] **Lojas parceiras:** cadastro, desconto por regra, vigência, elegibilidade, auditoria e limites de uso.
- [ ] **Indicações:** links únicos com token não adivinhável, atribuição de lead, deduplicação, consentimento, eventos de conversão, comissões pendentes/aprovadas/pagas, antifraude e estorno.
- [ ] **Financeiro e caixa:** sessões por operador/unidade, sangria/suprimento, conferência por meio de pagamento, diferença de caixa, contas a pagar/receber, conciliação, estorno e relatórios.
- [ ] **Ducha Elitte — SaaS:** homologar cadastro autônomo, teste de 7 dias, banco Neon dedicado por empresa, convites por e-mail, checkout e webhooks Stripe com idempotência; **NÃO aplicar neste repositório** sem decisão expressa.
- [ ] **Ducha Elitte — aplicativos/maquininhas:** avaliar App Store, Play Store e SDKs/catálogos oficiais das adquirentes; distribuição condicionada a requisitos de cada fabricante; **NÃO publicar nem prometer compatibilidade sem homologação**.
- [ ] **Ducha Elitte — e-mail de gestão:** titular cria conta exclusiva e configura MFA/passkeys, recuperação, domínio e acessos mínimos; nunca solicitar senha ou código ao assistente. Credenciais somente em cofre privado.

## Critérios de aceite
1. Testes automatizados de regras financeiras, estoque, cancelamento e isolamento multiempresa.
2. E2E de comanda com serviço e produto, pagamento por meio, vistoria, PDF e fechamento.
3. Testes de PDF em desktop e iPhone/Android, com WebGL indisponível.
4. Auditoria completa para mudanças de tipo, avarias, preço, cancelamento e comissões.
5. Nenhuma alteração ou deploy em produção da Ducha Elitte a partir deste backlog.

**Estado:** requisitos documentados; nenhum item marcado como implementado ou homologado neste documento.
