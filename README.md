# 🔥 LumeFood

Plataforma de delivery de comida desenvolvida pela **LumeStack** como ambiente de ensino para **planejamento e execução de testes de software**. O sistema replica os principais fluxos de um app de delivery real — cadastro, carrinho, checkout, acompanhamento de pedidos e painel administrativo — com código intencional e regras de negócio documentadas para facilitar o aprendizado de QA.

---

## Sumário

- [Stack tecnológica](#stack-tecnológica)
- [Setup do ambiente](#setup-do-ambiente)
- [Usuários e credenciais](#usuários-e-credenciais)
- [Rotas do sistema](#rotas-do-sistema)
- [Como o sistema funciona](#como-o-sistema-funciona)
- [Regras de negócio](#regras-de-negócio)
- [Fluxo de status do pedido](#fluxo-de-status-do-pedido)
- [Testes automatizados](#testes-automatizados)
- [Estrutura do projeto](#estrutura-do-projeto)

---

## Stack tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.2 | Framework full-stack (App Router) |
| React | 19 | Interface do usuário |
| TypeScript | 5 | Tipagem estática |
| Prisma | 7 | ORM |
| PostgreSQL | — | Banco de dados (Neon / local) |
| NextAuth.js | 5 beta | Autenticação com JWT |
| Zod | 4 | Validação de dados |
| Sonner | 2 | Notificações toast |
| Tailwind CSS | 4 | Estilização |
| Playwright | 1.59 | Testes E2E automatizados |

---

## Setup do ambiente

### Pré-requisitos

- Node.js 20.9+
- PostgreSQL (local ou Neon)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lumefood"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Criar tabelas e popular o banco

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Iniciar o servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Reset completo do banco

```bash
npm run db:reset
```

---

## Usuários e credenciais

### Clientes (`CUSTOMER`)

| Nome | E-mail | Senha |
|------|--------|-------|
| João Silva | `joao@lumefood.com` | `senha123` |
| Maria Souza | `maria@lumefood.com` | `senha123` |
| Pedro Costa | `pedro@lumefood.com` | `senha123` |

### Admins de restaurante (`RESTAURANT_ADMIN`)

| E-mail | Senha | Restaurante |
|--------|-------|-------------|
| `admin.pizzaria@lumefood.com` | `admin123` | Bella Napoli Pizza |
| `admin.burguer@lumefood.com` | `admin123` | BurgerHouse |
| `admin.pizzaexpress@lumefood.com` | `admin123` | Pizza Express |
| `admin.sushi@lumefood.com` | `admin123` | Sushi Zen |
| `admin.frango@lumefood.com` | `admin123` | FrangoGrill |
| `admin.salad@lumefood.com` | `admin123` | Salad & Go |

### Cupom de desconto

| Código | Desconto | Status |
|--------|----------|--------|
| `LUMEFOOD10` | 10% sobre o subtotal | Ativo |

---

## Rotas do sistema

### Páginas (Frontend)

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Home — listagem de restaurantes com filtros | Público |
| `/login` | Login com e-mail e senha | Público |
| `/register` | Cadastro de novo usuário | Público |
| `/restaurante/:id` | Cardápio do restaurante | Público |
| `/carrinho` | Carrinho de compras | Autenticado |
| `/checkout` | Finalizar pedido | Autenticado |
| `/pedidos` | Histórico de pedidos | Autenticado |
| `/pedidos/:id` | Detalhes e acompanhamento do pedido | Autenticado |
| `/admin` | Dashboard do restaurante | RESTAURANT_ADMIN |
| `/admin/restaurante` | Gerenciar perfil do restaurante | RESTAURANT_ADMIN |
| `/admin/cardapio` | Gerenciar itens do cardápio | RESTAURANT_ADMIN |
| `/admin/pedidos` | Gerenciar pedidos recebidos | RESTAURANT_ADMIN |

### API REST

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/restaurantes` | Listar todos os restaurantes | Público |
| `GET` | `/api/restaurantes/:id` | Detalhes do restaurante | Público |
| `GET` | `/api/restaurantes/:id/cardapio` | Cardápio com categorias e itens | Público |
| `POST` | `/api/register` | Cadastrar novo usuário | Público |
| `GET` | `/api/carrinho` | Visualizar carrinho atual | Autenticado |
| `DELETE` | `/api/carrinho` | Limpar todo o carrinho | Autenticado |
| `POST` | `/api/carrinho/items` | Adicionar item ao carrinho | Autenticado |
| `PATCH` | `/api/carrinho/items/:id` | Alterar quantidade de item | Autenticado |
| `DELETE` | `/api/carrinho/items/:id` | Remover item do carrinho | Autenticado |
| `POST` | `/api/cupons/validar` | Validar cupom e calcular desconto | Autenticado |
| `GET` | `/api/pedidos` | Listar pedidos do usuário | Autenticado |
| `POST` | `/api/pedidos` | Criar novo pedido | Autenticado |
| `GET` | `/api/pedidos/:id` | Detalhes do pedido | Autenticado |
| `PATCH` | `/api/pedidos/:id/status` | Atualizar status do pedido | RESTAURANT_ADMIN |
| `POST` | `/api/avaliacoes` | Enviar avaliação de pedido entregue | Autenticado |
| `GET` | `/api/admin/restaurante` | Dados do restaurante gerenciado | RESTAURANT_ADMIN |
| `PATCH` | `/api/admin/restaurante` | Editar dados do restaurante | RESTAURANT_ADMIN |
| `GET` | `/api/admin/cardapio` | Listar itens do cardápio | RESTAURANT_ADMIN |
| `POST` | `/api/admin/cardapio` | Criar item no cardápio | RESTAURANT_ADMIN |
| `PATCH` | `/api/admin/cardapio/:id` | Editar item do cardápio | RESTAURANT_ADMIN |
| `DELETE` | `/api/admin/cardapio/:id` | Excluir item do cardápio | RESTAURANT_ADMIN |
| `GET` | `/api/admin/pedidos` | Listar pedidos do restaurante | RESTAURANT_ADMIN |

---

## Como o sistema funciona

O LumeFood possui dois perfis de usuário com jornadas distintas:

### Jornada do cliente (`CUSTOMER`)

```
Cadastro / Login
      ↓
Home — navega pelos restaurantes, filtra por categoria
      ↓
Página do restaurante — visualiza o cardápio e adiciona itens ao carrinho
      ↓
Carrinho — ajusta quantidades, remove itens, aplica cupom de desconto
      ↓
Checkout — informa endereço de entrega e forma de pagamento, confirma o pedido
      ↓
Acompanhamento — visualiza a timeline de status do pedido em tempo real
      ↓
Avaliação — após a entrega, envia nota (1–5 estrelas) e comentário
```

### Jornada do admin (`RESTAURANT_ADMIN`)

```
Login com conta de admin do restaurante
      ↓
Dashboard — visualiza métricas: total de pedidos, pendentes e receita do dia
      ↓
Restaurante — edita informações, taxa de entrega, pedido mínimo e abre/fecha o restaurante
      ↓
Cardápio — cria, edita e exclui itens; organiza por categorias
      ↓
Pedidos — monitora pedidos recebidos, avança o status pela linha de produção
```

---

## Regras de negócio

### Autenticação e perfis

- Novos usuários são criados sempre com o papel `CUSTOMER`.
- A senha mínima tem **6 caracteres**. O hash é gerado com `bcryptjs` (salt rounds: 10).
- E-mails são únicos no sistema — não é possível cadastrar dois usuários com o mesmo e-mail.
- Sessões são mantidas via JWT (NextAuth 5). Rotas protegidas redirecionam para `/login` caso não haja sessão ativa.
- Cada `RESTAURANT_ADMIN` gerencia exatamente um restaurante (relação 1:1). Um admin não consegue acessar pedidos ou dados de restaurantes de outros admins.

---

### Carrinho

- Cada usuário possui **um único carrinho** persistido no banco.
- **Restrição de restaurante único:** o carrinho só pode conter itens de um único restaurante por vez. Ao tentar adicionar itens de um restaurante diferente do que está no carrinho, a operação é bloqueada com o erro `DIFFERENT_RESTAURANT`.
- **Limite de quantidade:** a quantidade de cada item no carrinho é limitada a **10 unidades**. A tentativa de ultrapassar esse limite retorna erro `400`.
- Ao adicionar um item que já existe no carrinho, as quantidades são **somadas** (não substituídas).
- Se o carrinho não existir no momento da adição, ele é **criado automaticamente**.
- O campo `restaurantId` do carrinho é definido ao adicionar o primeiro item e é resetado para `null` ao limpar o carrinho.

---

### Checkout e criação do pedido

O sistema executa as seguintes validações em ordem antes de criar o pedido:

| # | Validação | Erro retornado |
|---|-----------|----------------|
| 1 | Carrinho deve ter ao menos 1 item | `400 Carrinho está vazio` |
| 2 | Restaurante vinculado ao carrinho deve existir | `404 Restaurante não encontrado` |
| 3 | Restaurante deve estar aberto (`isOpen = true`) | `400 Este restaurante está fechado no momento` |
| 4 | Subtotal ≥ pedido mínimo do restaurante | `400 Pedido mínimo é R$ X,XX` |

**Cálculo do total:**
```
subtotal    = soma(preço_item × quantidade)
desconto    = subtotal × cupom.discount  (se cupom válido e ativo)
total       = subtotal + taxa_de_entrega − desconto
```

**Cupom na criação do pedido:**
- O cupom é buscado pelo código (convertido para maiúsculas).
- Apenas a flag `isActive` é verificada nesta etapa. Se o cupom não existir ou estiver inativo, o desconto é ignorado sem retornar erro.
- Se o cupom for aplicado, o `usageCount` é incrementado em 1.

**Snapshot dos itens:**
- Os dados de nome e preço de cada item são copiados para o pedido no momento da criação. Alterações futuras no cardápio não afetam pedidos já realizados.

**Limpeza automática do carrinho:**
- Após o pedido ser criado com sucesso, todos os itens do carrinho são removidos e o `restaurantId` do carrinho é resetado para `null`.

---

### Cupons

| Campo | Comportamento |
|-------|---------------|
| `code` | Armazenado e buscado em maiúsculas |
| `discount` | Percentual em decimal (ex: `0.10` = 10%) |
| `isActive` | `false` desabilita o cupom completamente |
| `expiresAt` | Se definido, cupom não é aceito após essa data |
| `usageLimit` | Se definido, cupom não é aceito após atingir o limite |
| `usageCount` | Incrementado a cada pedido que aplica o cupom |

**Rota `/api/cupons/validar`:** valida expiração (`expiresAt`) e limite de uso (`usageLimit`), e retorna o valor do desconto calculado. **Não incrementa o `usageCount`.**

**Importante:** a rota de criação de pedido verifica apenas `isActive`. Um cupom expirado ou esgotado (mas com `isActive = true`) ainda seria aceito na criação do pedido — comportamento intencional para exploração em testes.

---

### Status do pedido

#### Transições válidas

```
PENDING ──────────→ ACCEPTED
    │                   │
    └──────────→ CANCELLED
                    │
                    ↓
                PREPARING
                    │
                    ↓
            OUT_FOR_DELIVERY
                    │
                    ↓
                DELIVERED
```

| Status atual | Próximos status permitidos |
|--------------|---------------------------|
| `PENDING` | `ACCEPTED`, `CANCELLED` |
| `ACCEPTED` | `PREPARING`, `CANCELLED` |
| `PREPARING` | `OUT_FOR_DELIVERY` |
| `OUT_FOR_DELIVERY` | `DELIVERED` |
| `DELIVERED` | — (estado terminal) |
| `CANCELLED` | — (estado terminal) |

- Apenas `RESTAURANT_ADMIN` pode atualizar o status.
- O admin só pode atualizar pedidos do restaurante que ele próprio gerencia.
- Cada transição gera um registro em `OrderStatusHistory` com o novo status e uma nota opcional.
- Transições inválidas retornam `400` com a mensagem `"Transição inválida: [STATUS_ATUAL] → [STATUS_DESTINO]"`.

#### Labels exibidas na UI

| Status interno | Label exibida |
|----------------|---------------|
| `PENDING` | Aguardando confirmação |
| `ACCEPTED` | Pedido aceito |
| `PREPARING` | Em preparo |
| `OUT_FOR_DELIVERY` | Saiu para entrega |
| `DELIVERED` | Entregue |
| `CANCELLED` | Cancelado |

---

### Avaliações

- Apenas pedidos com status `DELIVERED` podem ser avaliados.
- Cada pedido aceita **somente uma avaliação** (relação 1:1). Tentativas de avaliar novamente retornam `409`.
- A nota deve ser um inteiro entre **1 e 5**.
- O comentário é opcional.
- Após criar a avaliação, o sistema **recalcula automaticamente** o `rating` médio e o `reviewCount` do restaurante considerando todas as avaliações existentes.

---

### Cardápio (Admin)

- Itens são organizados em **categorias** (`MenuCategory`) dentro de cada restaurante.
- Ao criar um item, se a `categoryName` informada não existir, uma nova categoria é criada automaticamente.
- Cada item possui flag `isAvailable`. Itens com `isAvailable = false` **não aparecem** para clientes na página do restaurante.
- A exclusão de uma categoria remove em cascata todos os seus itens.

---

### Restaurante (Admin)

- O admin pode alternar o status `isOpen` do restaurante para abrir ou fechar.
- Com o restaurante fechado (`isOpen = false`), novos pedidos são bloqueados no checkout.
- Campos editáveis: nome, descrição, categoria, telefone, endereço, imagem, taxa de entrega, pedido mínimo e tempo estimado de entrega.
- O `rating` e o `reviewCount` são calculados pelo sistema a partir das avaliações — não são editáveis manualmente.

---

## Fluxo de status do pedido

```
Cliente faz o pedido          →  PENDING         (aguarda o restaurante aceitar)
Restaurante aceita            →  ACCEPTED        (pedido confirmado, vai para produção)
Restaurante começa a preparar →  PREPARING       (em preparo na cozinha)
Pedido saiu para entrega      →  OUT_FOR_DELIVERY (com o entregador)
Pedido entregue               →  DELIVERED       (concluído — cliente pode avaliar)

A qualquer momento (até ACCEPTED):
Restaurante cancela           →  CANCELLED       (estado terminal)
```

---

## Testes automatizados

O projeto usa **Playwright** com o padrão **Page Object Model (POM)**.

### Executar os testes

```bash
# Todos os testes
npm test

# Somente testes de autenticação
npm run test:auth

# Somente testes de carrinho
npm run test:cart

# Somente testes de checkout
npm run test:checkout

# Interface visual do Playwright
npm run test:ui

# Relatório HTML
npm run test:report
```

### Cobertura atual

| Suite | Casos de teste | Features cobertas |
|-------|---------------|-------------------|
| `auth.spec.ts` | CT-001 a CT-005 | Login, registro, proteção de rotas |
| `carrinho.spec.ts` | CT-006 a CT-010 | Adicionar, alterar, remover, cupom, restrição de restaurante |
| `checkout.spec.ts` | CT-011 a CT-015 | Pedido completo, validações, restaurante fechado, carrinho limpo |

Os casos de teste completos estão documentados em [`docs/casos-de-teste.md`](./docs/casos-de-teste.md).

O plano de testes está em [`docs/plano-de-testes.md`](./docs/plano-de-testes.md).

### Configuração

O Playwright está configurado em `playwright.config.ts` com:
- **`workers: 1`** — execução sequencial para evitar conflitos no banco compartilhado
- **Projeto `setup`** — faz login e persiste a sessão em `tests/.auth/user.json`
- **Projeto `auth`** — testes sem sessão (login/registro)
- **Projeto `authenticated`** — testes com sessão persistida (carrinho e checkout)
- **`baseURL`** configurável via variável `BASE_URL` (padrão: `https://lumefood.vercel.app`)

---

## Estrutura do projeto

```
lumefood/
├── app/
│   ├── api/                    # Route Handlers (API REST)
│   │   ├── admin/              # Endpoints do painel admin
│   │   ├── avaliacoes/         # Criar avaliação
│   │   ├── carrinho/           # CRUD do carrinho
│   │   ├── cupons/             # Validar cupom
│   │   ├── pedidos/            # Criar e listar pedidos
│   │   ├── register/           # Cadastro de usuário
│   │   └── restaurantes/       # Listagem pública
│   ├── admin/                  # Painel administrativo
│   │   ├── cardapio/           # Gerenciar cardápio
│   │   ├── pedidos/            # Gerenciar pedidos
│   │   └── restaurante/        # Gerenciar perfil do restaurante
│   ├── carrinho/               # Página do carrinho
│   ├── checkout/               # Página de checkout
│   ├── login/                  # Página de login
│   ├── pedidos/                # Histórico e detalhes de pedidos
│   ├── register/               # Página de cadastro
│   ├── restaurante/[id]/       # Cardápio público do restaurante
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Home (listagem de restaurantes)
├── components/
│   ├── add-to-cart-button.tsx  # Botão de adicionar ao carrinho
│   ├── category-filters.tsx    # Filtros de categoria na home
│   └── header.tsx              # Header global com contador do carrinho
├── docs/
│   ├── plano-de-testes.md      # Plano de testes formal
│   └── casos-de-teste.md       # 15 casos de teste documentados
├── lib/
│   ├── auth.ts                 # Configuração do NextAuth
│   ├── prisma.ts               # PrismaClient singleton
│   └── utils.ts                # Labels, cores, transições de status e helpers
├── prisma/
│   ├── schema.prisma           # Schema do banco de dados
│   └── seed.ts                 # Dados de teste para desenvolvimento
└── tests/
    ├── e2e/                    # Testes Playwright
    │   ├── auth.setup.ts       # Setup de autenticação
    │   ├── auth.spec.ts        # Testes de autenticação
    │   ├── carrinho.spec.ts    # Testes de carrinho
    │   └── checkout.spec.ts    # Testes de checkout
    ├── helpers/
    │   └── cart.ts             # Utilitários de setup do carrinho via API
    └── pages/                  # Page Objects (POM)
        ├── LoginPage.ts
        ├── RegisterPage.ts
        ├── HomePage.ts
        ├── CarrinhoPage.ts
        └── CheckoutPage.ts
```

---

*Desenvolvido pela [LumeStack](https://github.com/LumeStack) para fins educacionais.*
