# Checklist de homologação

## Executável no laboratório (sem banco)
- [ ] Build Next.js com verificação de tipos
- [ ] `npm test` para transições de comanda
- [ ] Abrir demonstração com cliente, carro, serviços e comanda fictícios
- [ ] Criar cliente e veículo; verificar relacionamento
- [ ] Cadastrar serviço e agendamento
- [ ] Abrir comanda, selecionar peças, registrar ocorrência e checklist
- [ ] Renderizar e girar 3D em desktop e mobile; fallback sem WebGL
- [ ] Abrir caixa, registrar pagamento fictício e fechar
- [ ] Recebimentos não são confundidos com valor previsto
- [ ] Entrada e saída de estoque; bloquear estoque negativo
- [ ] Recarregar a página; persistência SOMENTE da demonstração
- [ ] Verificar `robots` noindex e deployment protection

## Obrigatório no banco de homologação
- [ ] Banco central separado dos bancos de cada empresa
- [ ] Zero possibilidade de ler/editar dados de outro lava-rápido
- [ ] Rejeição de login sem senha e de token expirado
- [ ] Verificação RBAC em TODAS as rotas e mutações
- [ ] Vistoria concluída impede edição e registra auditoria
- [ ] Comandas respeitam etapas e controle de versão
- [ ] Registros financeiros são idempotentes, transacionais e conciliáveis
- [ ] Estoque não admite saldo negativo nem race conditions
- [ ] Migrations reproduzíveis, backup com restore testado
- [ ] E2E acessível no iPhone/Android/Windows e com teclado
- [ ] Vulnerability scan, rate limit distribuído e testes de carga

Build READY e smoke checks não equivalem a aceite comercial.
