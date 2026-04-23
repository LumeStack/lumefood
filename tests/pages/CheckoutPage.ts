import { Page } from '@playwright/test'

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash'

export class CheckoutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/checkout')
  }

  form() {
    return this.page.getByTestId('checkout-form')
  }

  addressInput() {
    return this.page.getByTestId('checkout-input-address')
  }

  paymentButton(method: PaymentMethod) {
    return this.page.getByTestId(`checkout-payment-${method}`)
  }

  submitButton() {
    return this.page.getByTestId('checkout-button-submit')
  }

  async fillAddress(address: string) {
    await this.addressInput().fill(address)
  }

  async selectPayment(method: PaymentMethod) {
    await this.paymentButton(method).click()
  }

  async submit() {
    await this.submitButton().click()
  }

  /**
   * Preenche e submete o formulário de checkout completo.
   */
  async completeCheckout(address: string, payment: PaymentMethod = 'pix') {
    await this.fillAddress(address)
    await this.selectPayment(payment)
    await this.submit()
  }
}
