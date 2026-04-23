import { Page, expect } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
    await expect(this.page.getByTestId('login-form')).toBeVisible()
  }

  async fillEmail(email: string) {
    await this.page.getByTestId('login-input-email').fill(email)
  }

  async fillPassword(password: string) {
    await this.page.getByTestId('login-input-password').fill(password)
  }

  async submit() {
    await this.page.getByTestId('login-button-submit').click()
  }

  async login(email: string, password: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
  }

  get form() {
    return this.page.getByTestId('login-form')
  }
}
