# Plano de Testes — LumeFood

**Projeto:** LumeFood — Plataforma de Delivery  
**Organização:** LumeStack  
**Versão:** 1.0  
**Data:** Abril de 2026  
**Responsável:** Time de QA — LumeStack  

---

## Sumário

1. [O que será testado](#1-o-que-será-testado)
2. [Como será testado](#2-como-será-testado)
3. [Quem vai testar](#3-quem-vai-testar)
4. [Riscos identificados](#4-riscos-identificados)
5. [Escolha da ferramenta de automação](#5-escolha-da-ferramenta-de-automação)

---

## 1. O que será testado

### 1.1 Módulo Cliente

#### Autenticação
| ID | Feature | Descrição |
|----|---------|-----------|
| F-001 | Registro de usuário | Criar conta com nome, e-mail e senha (mín. 6 caracteres) |
| F-002 | Login | Autenticar com e-mail e senha válidos |
| F-003 | Logout | Encerrar sessão e redirecionar para home |
| F-004 | Proteção de rotas | Redirecionar para `/login` ao acessar rotas autenticadas sem sessão |

#### Home — Descoberta de Restaurantes
| ID | Feature | Descrição |
|----|---------|-----------|
| F-005 | Listagem de restaurantes | Exibir todos os restaurantes ativos ordenados por avaliação |
| F-006 | Filtro por categoria | Filtrar restaurantes por categoria (Pizza, Hambúrguer, Sushi, etc.) |
| F-007 | Exibição de informações | Mostrar nome, avaliação, tempo de entrega, taxa e pedido mínimo |

#### Cardápio do Restaurante
| ID | Feature | Descrição |
|----|---------|-----------|
| F-008 | Visualização do cardápio | Exibir categorias e itens disponíveis do restaurante |
| F-009 | Itens indisponíveis | Ocultar itens com `isAvailable = false` |
| F-010 | Restaurante fechado | Exibir aviso quando `isOpen = false` |

#### Carrinho
| ID | Feature | Descrição |
|----|---------|-----------|
| F-011 | Adicionar item | Adicionar item ao carrinho; criar carrinho se não existir |
| F-012 | Restrição de restaurante único | Bloquear adição de itens de restaurante diferente ao que está no carrinho |
| F-013 | Alterar quantidade | Incrementar e decrementar quantidade (mín. 1, máx. 10) |
| F-014 | Remover item | Remover item individualmente do carrinho |
| F-015 | Aplicar cupom | Validar e aplicar cupom de desconto ao subtotal |
| F-016 | Remover cupom | Remover cupom aplicado e recalcular total |
| F-017 | Resumo do pedido | Exibir subtotal, desconto, taxa de entrega e total |

#### Checkout
| ID | Feature | Descrição |
|----|---------|-----------|
| F-018 | Endereço de entrega | Preencher e validar endereço (campo obrigatório) |
| F-019 | Forma de pagamento | Selecionar entre PIX, Cartão de Crédito, Cartão de Débito, Dinheiro |
| F-020 | Validação de pedido mínimo | Bloquear pedido abaixo do valor mínimo do restaurante |
| F-021 | Validação de restaurante aberto | Bloquear pedido se restaurante estiver fechado |
| F-022 | Criação do pedido | Finalizar pedido com sucesso e redirecionar para detalhes |
| F-023 | Limpeza do carrinho | Carrinho vazio após pedido criado com sucesso |

#### Pedidos (Cliente)
| ID | Feature | Descrição |
|----|---------|-----------|
| F-024 | Histórico de pedidos | Listar todos os pedidos do usuário logado |
| F-025 | Detalhes do pedido | Exibir itens, status, endereço, pagamento e total |
| F-026 | Acompanhamento de status | Exibir timeline: Pendente → Aceito → Preparando → Saiu → Entregue |
| F-027 | Avaliação pós-entrega | Enviar avaliação (1–5 estrelas + comentário) somente para pedidos ENTREGUE |
| F-028 | Unicidade de avaliação | Permitir apenas uma avaliação por pedido |

---

### 1.2 Módulo Admin (RESTAURANT_ADMIN)

#### Dashboard
| ID | Feature | Descrição |
|----|---------|-----------|
| F-029 | Total de pedidos | Exibir contagem total de pedidos do restaurante |
| F-030 | Pedidos pendentes | Exibir quantidade de pedidos com status PENDING |
| F-031 | Receita do dia | Somar total de pedidos não cancelados criados no dia |
| F-032 | Pedidos recentes | Listar os 5 pedidos mais recentes em tabela |

#### Gerenciamento do Restaurante
| ID | Feature | Descrição |
|----|---------|-----------|
| F-033 | Editar informações | Atualizar nome, descrição, categoria, telefone, endereço e imagem |
| F-034 | Toggle aberto/fechado | Alternar status `isOpen` do restaurante |
| F-035 | Configurações de entrega | Editar taxa de entrega, pedido mínimo e tempo estimado |

#### Gerenciamento do Cardápio
| ID | Feature | Descrição |
|----|---------|-----------|
| F-036 | Listar itens | Exibir todos os itens do cardápio com categoria, preço e disponibilidade |
| F-037 | Adicionar item | Criar novo item com nome, categoria, preço e descrição |
| F-038 | Editar item | Atualizar dados de um item existente |
| F-039 | Excluir item | Remover item do cardápio |
| F-040 | Criação automática de categoria | Criar categoria ao adicionar item com `categoryName` novo |

#### Gerenciamento de Pedidos (Admin)
| ID | Feature | Descrição |
|----|---------|-----------|
| F-041 | Listar pedidos do restaurante | Exibir todos os pedidos recebidos pelo restaurante |
| F-042 | Filtrar por status | Filtrar pedidos por: Todos, Pendente, Aceito, Preparando, Saiu, Entregue, Cancelado |
| F-043 | Atualizar status | Avançar status com transições válidas |
| F-044 | Transições válidas | PENDING→ACCEPTED/CANCELLED · ACCEPTED→PREPARING/CANCELLED · PREPARING→OUT_FOR_DELIVERY · OUT_FOR_DELIVERY→DELIVERED |
| F-045 | Auto-refresh | Atualizar lista de pedidos a cada 30 segundos |

---

## 2. Como será testado

### 2.1 Testes Manuais

Os testes manuais cobrem cenários que exigem julgamento humano, avaliação visual ou exploração criativa.

#### Happy Path (fluxo principal)
Execução completa do fluxo ideal sem erros:
1. Registro e login como cliente
2. Navegar pela home e selecionar restaurante
3. Adicionar itens ao carrinho
4. Aplicar cupom de desconto
5. Finalizar pedido com endereço e forma de pagamento
6. Acompanhar atualização de status pelo admin
7. Avaliar o pedido após entrega

#### Edge Cases e Cenários Negativos
- Tentar adicionar itens de dois restaurantes diferentes no carrinho
- Tentar finalizar pedido abaixo do valor mínimo
- Tentar fazer pedido em restaurante fechado
- Tentar avaliar pedido que ainda não foi entregue
- Inserir cupom expirado, inativo ou com limite atingido
- Acessar rotas de admin como cliente

#### Testes de Responsividade
- Desktop (1920×1080, 1280×720)
- Tablet (768×1024)
- Mobile (375×812 — iPhone, 360×800 — Android)

#### Testes Exploratórios
Sessões livres de 30–60 minutos por sprint, sem roteiro fixo, com objetivo de encontrar comportamentos inesperados.

---

### 2.2 Testes Automatizados

#### Estratégia E2E com Playwright

Os testes automatizados cobrirão os fluxos críticos de negócio utilizando o padrão **Page Object Model (POM)**.

**Estrutura de diretórios proposta:**
```
tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── home.spec.ts
│   ├── restaurante.spec.ts
│   ├── carrinho.spec.ts
│   ├── checkout.spec.ts
│   ├── pedidos.spec.ts
│   └── admin/
│       ├── dashboard.spec.ts
│       ├── restaurante.spec.ts
│       ├── cardapio.spec.ts
│       └── pedidos.spec.ts
├── pages/
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── HomePage.ts
│   ├── RestaurantePage.ts
│   ├── CarrinhoPage.ts
│   ├── CheckoutPage.ts
│   ├── PedidosPage.ts
│   └── admin/
│       ├── AdminDashboardPage.ts
│       ├── AdminRestaurantePage.ts
│       ├── AdminCardapioPage.ts
│       └── AdminPedidosPage.ts
└── fixtures/
    └── auth.fixture.ts
```

**Localizadores baseados em `data-testid`:** Todos os elementos críticos do sistema possuem atributos `data-testid` adicionados, garantindo seletores estáveis que não quebram com mudanças visuais.

**Suite de regressão crítica (executada a cada PR):**
```
login → home → selecionar restaurante → adicionar item → checkout → verificar pedido criado
```

#### Testes de API com Playwright Request
Uso do contexto `request` do Playwright para validar as respostas das rotas REST sem depender da UI:
- Validação de status HTTP
- Validação do schema de resposta
- Testes de autenticação e autorização

---

## 3. Quem vai testar

| Papel | Responsabilidade |
|-------|-----------------|
| **QA Engineer** | Executar testes manuais, escrever e manter scripts Playwright |
| **Desenvolvedores** | Escrever testes unitários de funções e APIs, corrigir falhas identificadas |
| **Product Owner** | Executar testes de aceitação (UAT) em ambiente de homologação antes de cada release |

**Time de QA — LumeStack**  
Repositório: [https://github.com/LumeStack/lumefood](https://github.com/LumeStack/lumefood)

---

## 4. Riscos identificados

Os riscos abaixo foram levantados a partir da análise direta do código-fonte do LumeFood.

| # | Risco | Severidade | Como identificar na UI |
|---|-------|-----------|------------------------|
| R-01 | **Sem processamento real de pagamento** — Pedidos são criados sem verificar se o pagamento foi aprovado; qualquer forma de pagamento é aceita imediatamente | Alta | Selecionar qualquer pagamento no checkout e finalizar — pedido é criado sem validação |
| R-02 | **Precisão Float em preços** — Preços armazenados como `Float` podem gerar erros de arredondamento (ex: R$ 29,99 × 3 = R$ 89,97000...001) | Média | Observar o total no carrinho e no resumo do pedido ao adicionar múltiplos itens |
| R-03 | **NextAuth em versão beta** — `next-auth@5.0.0-beta.30` pode causar quedas de sessão inesperadas ou falhas no login | Média | Sessão pode expirar ou deslogar o usuário sem aviso durante a navegação |
| R-04 | **Sem verificação de e-mail** — Qualquer e-mail pode ser cadastrado sem confirmação, incluindo endereços inválidos ou fictícios | Baixa | Tentar registrar com e-mails como `teste@naoexiste.xyz` — conta é criada normalmente |
| R-05 | **isOpen verificado apenas na criação do pedido** — Se o restaurante fechar enquanto o usuário está no checkout, o pedido ainda pode ser finalizado | Baixa | Abrir o checkout, fechar o restaurante via admin e tentar submeter o pedido |

### Estratégia de mitigação recomendada

- **R-01:** Implementar integração com gateway de pagamento (ex: Stripe, Mercado Pago) antes do go-live em produção
- **R-02:** Migrar preços para `Int` (centavos) ou usar `Decimal` no Prisma
- **R-03:** Monitorar changelogs do NextAuth; fixar a versão no `package.json` e testar regressão a cada atualização
- **R-04:** Adicionar validação de formato de e-mail e, futuramente, confirmação por link
- **R-05:** Verificar `isOpen` no momento exato do POST em `/api/pedidos`, não somente na renderização do checkout

---

## 5. Escolha da ferramenta de automação

### 5.1 Comparativo: Playwright vs Cypress vs Selenium (JavaScript/TypeScript)

| Critério | Playwright | Cypress | Selenium |
|----------|-----------|---------|----------|
| **Suporte multi-browser** | ✅ Chromium, Firefox, WebKit | ⚠️ Chrome, Firefox (experimental) | ✅ Todos os browsers via WebDriver |
| **TypeScript nativo** | ✅ Suporte de primeira classe | ✅ Suporte com configuração | ⚠️ Necessita @types/selenium-webdriver |
| **Velocidade de execução** | ✅ Rápido (paralelo por padrão) | ⚠️ Médio (serial por padrão no free) | ❌ Lento (WebDriver overhead) |
| **Developer Experience** | ✅ Excelente (Trace Viewer, Codegen) | ✅ Excelente (Time Travel, hot reload) | ❌ Complexo (setup manual, sem debug visual) |
| **Suporte a Next.js/React** | ✅ Nativo, sem limitações | ✅ Bom (component testing integrado) | ⚠️ Funciona, mas sem integração especial |
| **Page Object Model** | ✅ Padrão recomendado e documentado | ✅ Suportado | ✅ Padrão histórico |
| **Testes de API** | ✅ `request` context nativo | ⚠️ `cy.request()` funcional | ❌ Não suportado nativamente |
| **Interceptação de rede** | ✅ `route()` nativo e robusto | ✅ `cy.intercept()` funcional | ❌ Requer biblioteca adicional |
| **Execução em CI/CD** | ✅ Docker nativo, sem config extra | ⚠️ Requer configuração adicional | ⚠️ Necessita chromedriver/geckodriver |
| **Custo** | ✅ 100% gratuito e open source | ⚠️ Gratuito com limitações (Dashboard pago) | ✅ 100% gratuito e open source |
| **Maturidade / Comunidade** | ✅ Mantido pela Microsoft, crescendo rapidamente | ✅ Ampla comunidade e documentação | ✅ Maturidade de 15+ anos, enorme comunidade |
| **Flakiness (instabilidade)** | ✅ Auto-wait robusto | ✅ Auto-retry integrado | ❌ Alta incidência de testes instáveis |
| **Shadow DOM / iframes** | ✅ Suporte nativo | ❌ Limitado | ✅ Suportado via WebDriver |

### 5.2 Decisão: Playwright ✅

**Justificativa:**

O **Playwright** é a escolha ideal para o LumeFood pelos seguintes motivos:

1. **Stack alinhada:** O projeto usa Next.js 16 + React 19 + TypeScript — Playwright foi desenvolvido com foco nessa stack moderna e possui suporte de primeira classe.

2. **data-testid já implementados:** O LumeFood já possui atributos `data-testid` em todos os elementos críticos, o que se encaixa perfeitamente no padrão de seletores recomendado pelo Playwright.

3. **Testes E2E + API em um único framework:** Com o `request` context do Playwright é possível testar as rotas REST sem ferramentas adicionais.

4. **Gratuito e sem restrições:** Diferente do Cypress (Dashboard pago para paralelismo e relatórios avançados), o Playwright não possui plano pago.

5. **Multi-browser real:** O LumeFood deve funcionar em diferentes navegadores; Playwright testa em Chromium, Firefox e WebKit (Safari) sem custo adicional.

6. **Trace Viewer e Codegen:** Facilitam a criação de testes e a análise de falhas, reduzindo o tempo de diagnóstico para o time de QA.

### 5.3 Configuração inicial recomendada

```bash
# Instalar Playwright no projeto
npm init playwright@latest

# Executar todos os testes
npx playwright test

# Executar com interface visual
npx playwright test --ui

# Gerar testes automaticamente pelo navegador
npx playwright codegen https://lumefood.vercel.app
```

**Arquivo `playwright.config.ts` base:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

---

*Documento gerado e mantido pelo time de QA da LumeStack.*  
*Repositório: [https://github.com/LumeStack/lumefood](https://github.com/LumeStack/lumefood)*
