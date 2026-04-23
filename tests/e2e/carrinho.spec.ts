/**
 * carrinho.spec.ts
 * Automação dos casos de teste CT-006 a CT-010 — Feature: Carrinho
 *
 * Requer sessão autenticada (joao@lumefood.com).
 * O carrinho é limpo via API antes de cada teste para garantir isolamento.
 */
import { test, expect } from '@playwright/test'
import { CarrinhoPage } from '../pages/CarrinhoPage'
import { HomePage } from '../pages/HomePage'
import { clearCart, getRestaurants, getMenuItems, addItemToCart } from '../helpers/cart'

test.beforeEach(async ({ page }) => {
  await clearCart(page)
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-006 — Adicionar item ao carrinho
// ─────────────────────────────────────────────────────────────────────────────
test('CT-006 — Adicionar item ao carrinho', async ({ page }) => {
  const home = new HomePage(page)
  const carrinho = new CarrinhoPage(page)

  await home.goto()

  // Clica no primeiro restaurante aberto disponível
  // Rota: /restaurante/{id} (singular)
  await home.clickFirstRestaurant()
  await page.waitForURL(/\/restaurante\//)

  // Clica no primeiro botão de adicionar ao carrinho
  const addButton = page.locator('[data-testid^="add-to-cart-"]').first()
  await addButton.click()

  // Navega ao carrinho (o header re-monta e re-carrega o count do servidor)
  await page.goto('/carrinho')

  // Após navegação o header-cart-count deve aparecer (só renderiza quando count > 0)
  await expect(page.getByTestId('header-cart-count')).toBeVisible({ timeout: 8000 })

  // Item deve estar listado com quantidade 1
  const itemId = await carrinho.getFirstItemId()
  await expect(carrinho.cartItem(itemId)).toBeVisible()
  await expect(carrinho.quantityDisplay(itemId)).toHaveText('1')
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-007 — Alterar quantidade de item no carrinho
// ─────────────────────────────────────────────────────────────────────────────
test('CT-007 — Alterar quantidade de item no carrinho', async ({ page }) => {
  // Setup: adiciona item via API (Frango Grelhado, R$30)
  const restaurants = await getRestaurants(page)
  const frangoGrill = restaurants.find((r) => r.name === 'FrangoGrill')!
  const items = await getMenuItems(page, frangoGrill.id)
  const frangoGrelhado = items.find((i) => i.name === 'Frango Grelhado')!
  await addItemToCart(page, frangoGrelhado.id, 1)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()

  const itemId = await carrinho.getFirstItemId()

  // Incrementa quantidade para 2
  await carrinho.increaseQuantity(itemId)
  await expect(carrinho.quantityDisplay(itemId)).toHaveText('2')

  // Decrementa quantidade de volta para 1
  await carrinho.decreaseQuantity(itemId)
  await expect(carrinho.quantityDisplay(itemId)).toHaveText('1')
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-008 — Remover item do carrinho
// ─────────────────────────────────────────────────────────────────────────────
test('CT-008 — Remover item do carrinho', async ({ page }) => {
  // Setup: adiciona item via API
  const restaurants = await getRestaurants(page)
  const frangoGrill = restaurants.find((r) => r.name === 'FrangoGrill')!
  const items = await getMenuItems(page, frangoGrill.id)
  const frangoGrelhado = items.find((i) => i.name === 'Frango Grelhado')!
  await addItemToCart(page, frangoGrelhado.id, 1)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()

  const itemId = await carrinho.getFirstItemId()

  // Remove o item
  await carrinho.removeItem(itemId)

  // Item não deve mais estar visível após remoção
  await expect(carrinho.cartItem(itemId)).not.toBeVisible()

  // Navega novamente para /carrinho para forçar o header a re-buscar o count
  // (o header só busca o count na montagem do componente, não reage a mudanças na mesma página)
  await page.goto('/carrinho')
  await page.waitForLoadState('networkidle')

  // Com carrinho vazio, header-cart-count não deve ser renderizado (condicional: cartCount > 0)
  await expect(page.getByTestId('header-cart-count')).not.toBeVisible()

  // Página deve indicar carrinho vazio
  await expect(page.locator('text=/vazio|empty/i')).toBeVisible()
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-009 — Aplicar cupom de desconto válido
// ─────────────────────────────────────────────────────────────────────────────
test('CT-009 — Aplicar cupom de desconto válido', async ({ page }) => {
  // Setup: adiciona item acima do mínimo (Frango Grelhado R$30)
  const restaurants = await getRestaurants(page)
  const frangoGrill = restaurants.find((r) => r.name === 'FrangoGrill')!
  const items = await getMenuItems(page, frangoGrill.id)
  const frangoGrelhado = items.find((i) => i.name === 'Frango Grelhado')!
  await addItemToCart(page, frangoGrelhado.id, 1)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()

  // Aplica o cupom LUMEFOOD10 (10% de desconto)
  await carrinho.applyCoupon('LUMEFOOD10')

  // Botão de remover cupom deve aparecer (sinal de aplicação bem-sucedida)
  await expect(carrinho.removeCouponButton()).toBeVisible({ timeout: 10000 })

  // Campo de cupom não deve mais estar visível (ou estar desabilitado)
  await expect(carrinho.couponInput()).not.toBeVisible()
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-010 — Restrição de restaurante único no carrinho
// ─────────────────────────────────────────────────────────────────────────────
test('CT-010 — Restrição de restaurante único no carrinho', async ({ page }) => {
  // Setup: adiciona item do FrangoGrill ao carrinho
  const restaurants = await getRestaurants(page)
  const frangoGrill = restaurants.find((r) => r.name === 'FrangoGrill')!
  const frangoItems = await getMenuItems(page, frangoGrill.id)
  await addItemToCart(page, frangoItems[0].id, 1)

  // Conta inicial: 1 item no carrinho
  await page.goto('/')
  await expect(page.getByTestId('header-cart-count')).toHaveText('1')

  // Navega até a Bella Napoli (restaurante diferente) e tenta adicionar item
  // Rota usa /restaurante/{id} (singular)
  const bellaNapoli = restaurants.find((r) => r.name === 'Bella Napoli Pizza')!
  await page.goto(`/restaurante/${bellaNapoli.id}`)

  const addButton = page.locator('[data-testid^="add-to-cart-"]').first()
  await addButton.click()

  // Deve exibir aviso de conflito de restaurante
  const conflictToast = page.locator('text=/restaurante|outro|different/i')
  await expect(conflictToast).toBeVisible({ timeout: 8000 })

  // O carrinho deve continuar com apenas 1 item (do FrangoGrill)
  await expect(page.getByTestId('header-cart-count')).toHaveText('1')
})
