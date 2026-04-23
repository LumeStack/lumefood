# Casos de Teste — LumeFood

| Campo | Detalhe |
|-------|---------|
| **Projeto** | LumeFood — Plataforma de Delivery |
| **Versão** | 1.0.0 |
| **Data** | Abril de 2026 |
| **Responsável** | Equipe de QA — LumeStack |
| **Ambiente** | https://lumefood.vercel.app |
| **Stack** | Next.js 16, Prisma, NextAuth 5 beta |

---

## Sumário

- [Feature 1 — Autenticação](#feature-1--autenticação)
  - [CT-001 — Login com credenciais válidas](#ct-001--login-com-credenciais-válidas)
  - [CT-002 — Login com senha incorreta](#ct-002--login-com-senha-incorreta)
  - [CT-003 — Registro de novo usuário](#ct-003--registro-de-novo-usuário)
  - [CT-004 — Registro com e-mail já cadastrado](#ct-004--registro-com-e-mail-já-cadastrado)
  - [CT-005 — Proteção de rota autenticada](#ct-005--proteção-de-rota-autenticada)
- [Feature 2 — Carrinho](#feature-2--carrinho)
  - [CT-006 — Adicionar item ao carrinho](#ct-006--adicionar-item-ao-carrinho)
  - [CT-007 — Alterar quantidade de item no carrinho](#ct-007--alterar-quantidade-de-item-no-carrinho)
  - [CT-008 — Remover item do carrinho](#ct-008--remover-item-do-carrinho)
  - [CT-009 — Aplicar cupom de desconto válido](#ct-009--aplicar-cupom-de-desconto-válido)
  - [CT-010 — Restrição de restaurante único no carrinho](#ct-010--restrição-de-restaurante-único-no-carrinho)
- [Feature 3 — Checkout](#feature-3--checkout)
  - [CT-011 — Finalizar pedido com sucesso](#ct-011--finalizar-pedido-com-sucesso)
  - [CT-012 — Validação de pedido mínimo não atingido](#ct-012--validação-de-pedido-mínimo-não-atingido)
  - [CT-013 — Bloqueio de checkout para restaurante fechado](#ct-013--bloqueio-de-checkout-para-restaurante-fechado)
  - [CT-014 — Endereço de entrega obrigatório](#ct-014--endereço-de-entrega-obrigatório)
  - [CT-015 — Limpeza do carrinho após finalização do pedido](#ct-015--limpeza-do-carrinho-após-finalização-do-pedido)
- [Totalizador](#totalizador)

---

## Feature 1 — Autenticação

---

### CT-001 — Login com credenciais válidas

| Campo | Detalhe |
|-------|---------|
| **Feature** | Autenticação |
| **Tipo** | Manual |
| **Severidade** | Crítico |
| **Pré-condições** | Usuário `customer@lumefood.com` cadastrado via seed; nenhuma sessão ativa no navegador |

**Passos:**
1. Acessar `https://lumefood.vercel.app/login`.
2. Localizar o formulário identificado por `login-form`.
3. Preencher o campo `login-input-email` com `customer@lumefood.com`.
4. Preencher o campo `login-input-password` com `123456`.
5. Clicar no botão `login-button-submit`.

**Resultado esperado:**
O usuário é autenticado com sucesso e redirecionado para a página inicial (`/`). O header exibe o ícone de carrinho (`header-link-cart`) e o botão de logout (`header-button-logout`), confirmando que a sessão foi estabelecida com o role `CUSTOMER`.

**data-testid utilizados:** `login-form`, `login-input-email`, `login-input-password`, `login-button-submit`, `header-link-cart`, `header-button-logout`

---

### CT-002 — Login com senha incorreta

| Campo | Detalhe |
|-------|---------|
| **Feature** | Autenticação |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Nenhuma sessão ativa no navegador |

**Passos:**
1. Acessar `https://lumefood.vercel.app/login`.
2. Localizar o formulário identificado por `login-form`.
3. Preencher o campo `login-input-email` com `customer@lumefood.com`.
4. Preencher o campo `login-input-password` com `senhaerrada`.
5. Clicar no botão `login-button-submit`.

**Resultado esperado:**
O sistema permanece na página `/login` e exibe uma mensagem de erro indicando credenciais inválidas (ex.: "E-mail ou senha incorretos"). Nenhuma sessão é criada e o botão `header-button-logout` não aparece no header.

**data-testid utilizados:** `login-form`, `login-input-email`, `login-input-password`, `login-button-submit`

---

### CT-003 — Registro de novo usuário

| Campo | Detalhe |
|-------|---------|
| **Feature** | Autenticação |
| **Tipo** | Manual |
| **Severidade** | Crítico |
| **Pré-condições** | O e-mail `novousuario_teste@lumefood.com` não deve estar cadastrado no banco de dados |

**Passos:**
1. Acessar `https://lumefood.vercel.app/register`.
2. Localizar o formulário identificado por `register-form`.
3. Preencher o campo `register-input-name` com `Usuário Teste`.
4. Preencher o campo `register-input-email` com `novousuario_teste@lumefood.com`.
5. Preencher o campo `register-input-password` com `Senha@123`.
6. Clicar no botão `register-button-submit`.

**Resultado esperado:**
A conta é criada com sucesso com role `CUSTOMER`. O usuário é redirecionado para a página inicial (`/`) já autenticado. O header exibe `header-link-cart` e `header-button-logout`.

**data-testid utilizados:** `register-form`, `register-input-name`, `register-input-email`, `register-input-password`, `register-button-submit`, `header-link-cart`, `header-button-logout`

---

### CT-004 — Registro com e-mail já cadastrado

| Campo | Detalhe |
|-------|---------|
| **Feature** | Autenticação |
| **Tipo** | Manual |
| **Severidade** | Médio |
| **Pré-condições** | Usuário `customer@lumefood.com` já cadastrado via seed; nenhuma sessão ativa no navegador |

**Passos:**
1. Acessar `https://lumefood.vercel.app/register`.
2. Localizar o formulário identificado por `register-form`.
3. Preencher o campo `register-input-name` com `Qualquer Nome`.
4. Preencher o campo `register-input-email` com `customer@lumefood.com`.
5. Preencher o campo `register-input-password` com `123456`.
6. Clicar no botão `register-button-submit`.

**Resultado esperado:**
O sistema permanece na página `/register` e exibe uma mensagem de erro informando que o e-mail já está em uso (ex.: "Este e-mail já está cadastrado"). Nenhuma conta duplicada é criada e nenhuma sessão é iniciada.

**data-testid utilizados:** `register-form`, `register-input-name`, `register-input-email`, `register-input-password`, `register-button-submit`

---

### CT-005 — Proteção de rota autenticada

| Campo | Detalhe |
|-------|---------|
| **Feature** | Autenticação |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Nenhuma sessão ativa no navegador (usuário deslogado ou aba anônima) |

**Passos:**
1. Sem efetuar login, acessar diretamente `https://lumefood.vercel.app/checkout` na barra de endereços do navegador.

**Resultado esperado:**
O sistema detecta que não há sessão ativa e redireciona automaticamente o usuário para `/login`. A página de checkout não é exibida e nenhum dado sensível fica exposto.

**data-testid utilizados:** `login-form`

---

## Feature 2 — Carrinho

---

### CT-006 — Adicionar item ao carrinho

| Campo | Detalhe |
|-------|---------|
| **Feature** | Carrinho |
| **Tipo** | Manual |
| **Severidade** | Crítico |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho vazio |

**Passos:**
1. Acessar `https://lumefood.vercel.app`.
2. Localizar um card de restaurante aberto (ex.: `restaurant-card-{id}`) e clicar nele.
3. Na página do restaurante, localizar um produto disponível e clicar no botão de adicionar ao carrinho.
4. Observar o header após a ação.

**Resultado esperado:**
O item é adicionado ao carrinho. O contador exibido em `header-cart-count` passa a exibir `1`. Ao navegar para a página do carrinho, o elemento `cart-item-{id}` correspondente ao produto adicionado é exibido com quantidade `1` em `cart-quantity-{id}`.

**data-testid utilizados:** `restaurant-card-{id}`, `header-link-cart`, `header-cart-count`, `cart-item-{id}`, `cart-quantity-{id}`

---

### CT-007 — Alterar quantidade de item no carrinho

| Campo | Detalhe |
|-------|---------|
| **Feature** | Carrinho |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho contendo exatamente 1 unidade de um produto |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Localizar o item desejado pelo elemento `cart-item-{id}`.
3. Clicar no botão `cart-button-increase-{id}` uma vez.
4. Verificar o valor exibido em `cart-quantity-{id}`.
5. Clicar no botão `cart-button-decrease-{id}` uma vez.
6. Verificar novamente o valor exibido em `cart-quantity-{id}`.

**Resultado esperado:**
Após o clique em aumentar, `cart-quantity-{id}` exibe `2` e o subtotal do pedido é atualizado para o dobro do preço unitário. Após o clique em diminuir, `cart-quantity-{id}` retorna a `1` e o subtotal é recalculado corretamente.

**data-testid utilizados:** `header-link-cart`, `cart-item-{id}`, `cart-button-increase-{id}`, `cart-button-decrease-{id}`, `cart-quantity-{id}`

---

### CT-008 — Remover item do carrinho

| Campo | Detalhe |
|-------|---------|
| **Feature** | Carrinho |
| **Tipo** | Manual |
| **Severidade** | Médio |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho contendo apenas 1 item |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Localizar o item pelo elemento `cart-item-{id}`.
3. Clicar no botão `cart-button-remove-{id}`.

**Resultado esperado:**
O item é removido da lista do carrinho e o elemento `cart-item-{id}` desaparece da página. O contador `header-cart-count` exibe `0` ou é ocultado. A página exibe uma mensagem informando que o carrinho está vazio (ex.: "Seu carrinho está vazio").

**data-testid utilizados:** `header-link-cart`, `cart-item-{id}`, `cart-button-remove-{id}`, `header-cart-count`

---

### CT-009 — Aplicar cupom de desconto válido

| Campo | Detalhe |
|-------|---------|
| **Feature** | Carrinho |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com ao menos 1 item; cupom `DESCONTO10` ativo no seed (10% de desconto) |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Localizar o campo `cart-input-coupon`.
3. Digitar `DESCONTO10` no campo.
4. Clicar no botão `cart-button-apply-coupon`.
5. Observar o resumo financeiro do carrinho.

**Resultado esperado:**
O sistema valida o cupom e aplica um desconto de 10% sobre o subtotal dos produtos. O resumo exibe o valor original, o desconto aplicado e o novo total. O botão `cart-button-remove-coupon` fica visível, permitindo remover o cupom caso desejado.

**data-testid utilizados:** `header-link-cart`, `cart-input-coupon`, `cart-button-apply-coupon`, `cart-button-remove-coupon`

---

### CT-010 — Restrição de restaurante único no carrinho

| Campo | Detalhe |
|-------|---------|
| **Feature** | Carrinho |
| **Tipo** | Manual |
| **Severidade** | Médio |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho contendo 1 item de um restaurante (ex.: Restaurante A) |

**Passos:**
1. Acessar `https://lumefood.vercel.app` e navegar até um restaurante diferente do que gerou o item já no carrinho (ex.: Restaurante B).
2. Tentar adicionar um produto do Restaurante B ao carrinho.
3. Observar o comportamento do sistema.

**Resultado esperado:**
O sistema exibe um aviso ou modal informando que o carrinho já contém itens de outro restaurante e que não é possível misturar itens de restaurantes distintos no mesmo pedido. O item do Restaurante B não é adicionado e o carrinho permanece com o conteúdo original do Restaurante A.

**data-testid utilizados:** `header-link-cart`, `header-cart-count`, `cart-item-{id}`

---

## Feature 3 — Checkout

---

### CT-011 — Finalizar pedido com sucesso

| Campo | Detalhe |
|-------|---------|
| **Feature** | Checkout |
| **Tipo** | Manual |
| **Severidade** | Crítico |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com itens de um restaurante aberto que atendem ao pedido mínimo |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Clicar no botão `cart-button-checkout`.
3. Na página de checkout, localizar o formulário `checkout-form`.
4. Preencher o campo `checkout-input-address` com um endereço válido (ex.: `Rua das Flores, 123, São Paulo - SP`).
5. Selecionar a forma de pagamento `checkout-payment-pix`.
6. Clicar no botão `checkout-button-submit`.

**Resultado esperado:**
O pedido é criado com status `PENDING` e o usuário é redirecionado para uma página de confirmação (ex.: `/orders/{id}`) exibindo o resumo do pedido, o endereço informado e o status atual. O fluxo de status segue a sequência: `PENDING → ACCEPTED/CANCELLED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`.

**data-testid utilizados:** `header-link-cart`, `cart-button-checkout`, `checkout-form`, `checkout-input-address`, `checkout-payment-pix`, `checkout-button-submit`

---

### CT-012 — Validação de pedido mínimo não atingido

| Campo | Detalhe |
|-------|---------|
| **Feature** | Checkout |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com valor total abaixo do pedido mínimo configurado no restaurante |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Clicar no botão `cart-button-checkout`.
3. Na página de checkout, preencher o campo `checkout-input-address` com um endereço válido.
4. Selecionar a forma de pagamento `checkout-payment-credit_card`.
5. Clicar no botão `checkout-button-submit`.

**Resultado esperado:**
O sistema bloqueia a submissão e exibe uma mensagem de erro informando o valor mínimo exigido pelo restaurante (ex.: "O pedido mínimo deste restaurante é R$ 30,00"). Nenhum pedido é criado no banco de dados.

**data-testid utilizados:** `header-link-cart`, `cart-button-checkout`, `checkout-form`, `checkout-input-address`, `checkout-payment-credit_card`, `checkout-button-submit`

---

### CT-013 — Bloqueio de checkout para restaurante fechado

| Campo | Detalhe |
|-------|---------|
| **Feature** | Checkout |
| **Tipo** | Manual |
| **Severidade** | Alto |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com itens de um restaurante marcado como fechado no seed |

**Passos:**
1. Acessar `https://lumefood.vercel.app` e navegar até um restaurante fechado (disponível no seed).
2. Tentar adicionar um produto ao carrinho e prosseguir para o checkout.
3. Caso seja possível chegar à tela de checkout, clicar no botão `checkout-button-submit`.

**Resultado esperado:**
O sistema impede a finalização do pedido e exibe uma mensagem informando que o restaurante está fechado no momento (ex.: "Este restaurante está fechado e não está aceitando pedidos agora"). Nenhum pedido é criado.

**data-testid utilizados:** `cart-button-checkout`, `checkout-form`, `checkout-button-submit`

---

### CT-014 — Endereço de entrega obrigatório

| Campo | Detalhe |
|-------|---------|
| **Feature** | Checkout |
| **Tipo** | Manual |
| **Severidade** | Médio |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com itens de um restaurante aberto que atendem ao pedido mínimo |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart`.
2. Clicar no botão `cart-button-checkout`.
3. Na página de checkout, deixar o campo `checkout-input-address` vazio.
4. Selecionar a forma de pagamento `checkout-payment-debit_card`.
5. Clicar no botão `checkout-button-submit`.

**Resultado esperado:**
O sistema bloqueia a submissão e exibe uma mensagem de validação indicando que o endereço de entrega é obrigatório (ex.: "Informe o endereço de entrega para continuar"). O campo `checkout-input-address` recebe destaque visual de erro. Nenhum pedido é criado.

**data-testid utilizados:** `header-link-cart`, `cart-button-checkout`, `checkout-form`, `checkout-input-address`, `checkout-payment-debit_card`, `checkout-button-submit`

---

### CT-015 — Limpeza do carrinho após finalização do pedido

| Campo | Detalhe |
|-------|---------|
| **Feature** | Checkout |
| **Tipo** | Manual |
| **Severidade** | Baixo |
| **Pré-condições** | Usuário autenticado como `customer@lumefood.com`; carrinho com itens de um restaurante aberto que atendem ao pedido mínimo |

**Passos:**
1. Acessar a página do carrinho clicando em `header-link-cart` e verificar que há itens listados.
2. Clicar no botão `cart-button-checkout`.
3. Preencher o campo `checkout-input-address` com um endereço válido (ex.: `Av. Paulista, 1000, São Paulo - SP`).
4. Selecionar a forma de pagamento `checkout-payment-cash`.
5. Clicar no botão `checkout-button-submit`.
6. Após a confirmação do pedido, clicar em `header-link-cart` para retornar ao carrinho.

**Resultado esperado:**
O carrinho está completamente vazio após a finalização do pedido. O contador `header-cart-count` exibe `0` ou é ocultado. A página do carrinho exibe a mensagem de carrinho vazio, confirmando que os itens foram removidos automaticamente ao concluir o checkout.

**data-testid utilizados:** `header-link-cart`, `header-cart-count`, `cart-button-checkout`, `checkout-form`, `checkout-input-address`, `checkout-payment-cash`, `checkout-button-submit`, `cart-button-checkout`

---

## Totalizador

| Métrica | Valor |
|---------|-------|
| **Total de casos de teste** | 15 |
| **Total de features cobertas** | 3 |
| **Casos — Feature 1: Autenticação** | 5 (CT-001 a CT-005) |
| **Casos — Feature 2: Carrinho** | 5 (CT-006 a CT-010) |
| **Casos — Feature 3: Checkout** | 5 (CT-011 a CT-015) |
| **Casos críticos** | 3 (CT-001, CT-006, CT-011) |
| **Casos de alto impacto** | 6 (CT-002, CT-005, CT-007, CT-009, CT-012, CT-013) |
| **Casos de médio impacto** | 4 (CT-004, CT-008, CT-010, CT-014) |
| **Casos de baixo impacto** | 2 (CT-003\*, CT-015) |

> \* CT-003 foi classificado como Crítico; o valor acima reflete apenas CT-015 no nível Baixo, com CT-003 contabilizado nos Críticos.

| Distribuição de severidade corrigida | |
|--------------------------------------|--|
| Crítico | 3 (CT-001, CT-003, CT-006, CT-011) — 4 casos |
| Alto | 5 (CT-002, CT-005, CT-007, CT-009, CT-012, CT-013) — 6 casos |
| Médio | 4 (CT-004, CT-008, CT-010, CT-014) |
| Baixo | 1 (CT-015) |
