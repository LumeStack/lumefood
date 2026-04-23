/**
 * checkout.spec.ts
 * Automação dos casos de teste CT-011 a CT-015 — Feature: Checkout
 *
 * Requer sessão autenticada (joao@lumefood.com).
 * Cada teste configura o carrinho via API antes de executar.
 */
import { test, expect } from '@playwright/test'
import { CarrinhoPage } from '../pages/CarrinhoPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import {
  clearCart,
  setupCartAboveMinimum,
  setupCartBelowMinimum,
  setupCartClosedRestaurant,
} from '../helpers/cart'

test.beforeEach(async ({ page }) => {
  await clearCart(page)
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-011 — Finalizar pedido com sucesso
// ─────────────────────────────────────────────────────────────────────────────
test('CT-011 — Finalizar pedido com sucesso', async ({ page }) => {
  await setupCartAboveMinimum(page)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()
  await carrinho.proceedToCheckout()

  const checkout = new CheckoutPage(page)
  await expect(checkout.form()).toBeVisible()
  await checkout.completeCheckout('Rua das Flores, 123, São Paulo - SP', 'pix')

  // Deve redirecionar para página de detalhes do pedido
  await expect(page).toHaveURL(/\/pedidos\//, { timeout: 20000 })

  // Botão de voltar confirma que a página de detalhe do pedido foi carregada
  await expect(page.getByTestId('order-detail-button-back')).toBeVisible()

  // Status inicial deve ser "Aguardando confirmação" (label de PENDING no sistema)
  // Pode aparecer em dois elementos distintos (badge + timeline) — usa .first()
  await expect(page.locator('text=/Aguardando confirmação/i').first()).toBeVisible()
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-012 — Validação de pedido mínimo não atingido
// ─────────────────────────────────────────────────────────────────────────────
test('CT-012 — Validação de pedido mínimo não atingido', async ({ page }) => {
  // Suco de Laranja R$9 < mínimo R$25 da Bella Napoli
  await setupCartBelowMinimum(page)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()

  // O botão de checkout pode estar desabilitado, ou a API retornará erro
  const checkoutBtn = carrinho.checkoutButton()
  const isDisabled = await checkoutBtn.isDisabled().catch(() => false)

  if (isDisabled) {
    // Botão desabilitado: validação ocorreu na UI
    await expect(checkoutBtn).toBeDisabled()
    // Deve haver mensagem indicando o valor mínimo
    await expect(page.locator('text=/mínimo|minimum/i')).toBeVisible()
  } else {
    // Botão habilitado: navega para checkout e tenta submeter
    await checkoutBtn.click()
    await page.waitForURL('/checkout')

    const checkout = new CheckoutPage(page)
    await checkout.fillAddress('Rua das Flores, 123, São Paulo - SP')
    await checkout.selectPayment('credit_card')
    await checkout.submit()

    // Deve exibir erro de valor mínimo (toast ou mensagem inline)
    await expect(page.locator('text=/mínimo|minimum|R\$/i')).toBeVisible({ timeout: 10000 })

    // Não deve redirecionar para /pedidos/
    await expect(page).not.toHaveURL(/\/pedidos\//)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-013 — Bloqueio de checkout para restaurante fechado
// ─────────────────────────────────────────────────────────────────────────────
test('CT-013 — Bloqueio de checkout para restaurante fechado', async ({ page }) => {
  // Item do Pizza Express (isOpen = false) adicionado via API
  await setupCartClosedRestaurant(page)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()

  const checkoutBtn = carrinho.checkoutButton()
  const isDisabled = await checkoutBtn.isDisabled().catch(() => false)

  if (isDisabled) {
    // UI já bloqueia quando o restaurante está fechado
    await expect(checkoutBtn).toBeDisabled()
  } else {
    // Tenta finalizar e aguarda erro do servidor
    await checkoutBtn.click()

    // Pode ser redirecionado ao checkout ou erro direto no carrinho
    const url = page.url()
    if (url.includes('/checkout')) {
      const checkout = new CheckoutPage(page)
      await checkout.fillAddress('Rua das Flores, 123, São Paulo - SP')
      await checkout.selectPayment('pix')
      await checkout.submit()
    }

    // O pedido NÃO deve ter sido criado — URL permanece fora de /pedidos/
    // O toast de erro ("Este restaurante está fechado no momento") é transitório;
    // a verificação principal é que o redirecionamento para /pedidos/ não ocorreu.
    await expect(page).not.toHaveURL(/\/pedidos\//)

    // Verifica que ainda está em checkout ou carrinho (não avançou)
    expect(['/checkout', '/carrinho'].some((p) => page.url().includes(p))).toBe(true)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-014 — Endereço de entrega obrigatório
// ─────────────────────────────────────────────────────────────────────────────
test('CT-014 — Endereço de entrega obrigatório', async ({ page }) => {
  await setupCartAboveMinimum(page)

  const carrinho = new CarrinhoPage(page)
  await carrinho.goto()
  await carrinho.proceedToCheckout()

  const checkout = new CheckoutPage(page)
  await expect(checkout.form()).toBeVisible()

  // Seleciona pagamento mas deixa o endereço em branco
  await checkout.selectPayment('debit_card')
  await checkout.submit()

  // Deve permanecer no checkout — não redireciona para /pedidos/
  await expect(page).not.toHaveURL(/\/pedidos\//)

  // Deve exibir alguma indicação de validação do endereço
  const addressInput = checkout.addressInput()
  const validationVisible = await page.locator('text=/endereço|address|obrigatório|required/i').count()
  const inputInvalid = await addressInput.evaluate((el) =>
    (el as HTMLTextAreaElement).validity?.valueMissing
  )

  expect(validationVisible > 0 || inputInvalid).toBe(true)
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-015 — Limpeza do carrinho após finalização do pedido
// ─────────────────────────────────────────────────────────────────────────────
test('CT-015 — Limpeza do carrinho após finalização do pedido', async ({ page }) => {
  await setupCartAboveMinimum(page)

  // Verifica que há itens no carrinho antes do checkout
  await page.goto('/carrinho')
  // Aguarda carregamento completo (os itens são buscados via API após montagem)
  await page.waitForLoadState('networkidle')
  const itemsBefore = await page.locator('[data-testid^="cart-item-"]').count()
  expect(itemsBefore).toBeGreaterThan(0)

  const carrinho = new CarrinhoPage(page)
  await carrinho.proceedToCheckout()

  const checkout = new CheckoutPage(page)
  await checkout.completeCheckout('Av. Paulista, 1000, São Paulo - SP', 'cash')

  // Aguarda confirmação do pedido
  await expect(page).toHaveURL(/\/pedidos\//, { timeout: 20000 })

  // Volta ao carrinho
  await page.getByTestId('header-link-cart').click()
  await page.waitForURL('/carrinho')

  // Carrinho deve estar vazio
  const itemsAfter = await page.locator('[data-testid^="cart-item-"]').count()
  expect(itemsAfter).toBe(0)

  // Contador no header deve estar zerado ou oculto
  const cartCountEl = page.getByTestId('header-cart-count')
  const isVisible = await cartCountEl.isVisible().catch(() => false)
  if (isVisible) {
    await expect(cartCountEl).toHaveText('0')
  }

  // Mensagem de carrinho vazio deve aparecer
  await expect(page.locator('text=/vazio|empty/i')).toBeVisible()
})
