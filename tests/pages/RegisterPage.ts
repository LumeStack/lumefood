import { Page, expect } from '@playwright/test'

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register')
    await expect(this.page.getByTestId('register-form')).toBeVisible()
  }

  async fillName(name: string) {
    await this.page.getByTestId('register-input-name').fill(name)
  }

  async fillEmail(email: string) {
    await this.page.getByTestId('register-input-email').fill(email)
  }

  async fillPassword(password: string) {
    await this.page.getByTestId('register-input-password').fill(password)
  }

  async submit() {
    await this.page.getByTestId('register-button-submit').click()
  }

  async register(name: string, email: string, password: string) {
    await this.fillName(name)
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
  }

  get form() {
    return this.page.getByTestId('register-form')
  }
}
