import { Page } from '@playwright/test'

export class CarrinhoPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/carrinho')
  }

  /** Retorna o elemento do item no carrinho */
  cartItem(itemId: string) {
    return this.page.getByTestId(`cart-item-${itemId}`)
  }

  /** Retorna o primeiro item visível no carrinho sem precisar do ID */
  firstCartItem() {
    return this.page.locator('[data-testid^="cart-item-"]').first()
  }

  /** Extrai o itemId do primeiro elemento cart-item encontrado */
  async getFirstItemId(): Promise<string> {
    const el = this.firstCartItem()
    const testId = await el.getAttribute('data-testid')
    if (!testId) throw new Error('Nenhum item encontrado no carrinho')
    return testId.replace('cart-item-', '')
  }

  quantityDisplay(itemId: string) {
    return this.page.getByTestId(`cart-quantity-${itemId}`)
  }

  increaseButton(itemId: string) {
    return this.page.getByTestId(`cart-button-increase-${itemId}`)
  }

  decreaseButton(itemId: string) {
    return this.page.getByTestId(`cart-button-decrease-${itemId}`)
  }

  removeButton(itemId: string) {
    return this.page.getByTestId(`cart-button-remove-${itemId}`)
  }

  couponInput() {
    return this.page.getByTestId('cart-input-coupon')
  }

  applyCouponButton() {
    return this.page.getByTestId('cart-button-apply-coupon')
  }

  removeCouponButton() {
    return this.page.getByTestId('cart-button-remove-coupon')
  }

  checkoutButton() {
    return this.page.getByTestId('cart-button-checkout')
  }

  async applyCoupon(code: string) {
    await this.couponInput().fill(code)
    await this.applyCouponButton().click()
  }

  async increaseQuantity(itemId: string) {
    await this.increaseButton(itemId).click()
  }

  async decreaseQuantity(itemId: string) {
    await this.decreaseButton(itemId).click()
  }

  async removeItem(itemId: string) {
    await this.removeButton(itemId).click()
  }

  async proceedToCheckout() {
    await this.checkoutButton().click()
    await this.page.waitForURL('/checkout')
  }
}
