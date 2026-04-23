import { Page } from '@playwright/test'

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  /** Retorna o card de restaurante pelo nome */
  restaurantCardByName(name: string) {
    return this.page.locator(`[data-testid^="restaurant-card-"]`).filter({ hasText: name })
  }

  /** Retorna o primeiro card de restaurante visível */
  firstRestaurantCard() {
    return this.page.locator(`[data-testid^="restaurant-card-"]`).first()
  }

  async clickRestaurant(name: string) {
    await this.restaurantCardByName(name).click()
  }

  async clickFirstRestaurant() {
    await this.firstRestaurantCard().click()
  }

  /** Retorna o botão de adicionar ao carrinho pelo nome do item */
  addToCartButtonByItemName(itemName: string) {
    // Localiza o container do item pelo texto e depois o botão add-to-cart dentro dele
    return this.page
      .locator('text=' + itemName)
      .locator('xpath=ancestor::*[contains(@class, "card") or contains(@style, "border")]')
      .locator('[data-testid^="add-to-cart-"]')
      .first()
  }

  /** Retorna qualquer botão de adicionar ao carrinho visível na página */
  firstAddToCartButton() {
    return this.page.locator('[data-testid^="add-to-cart-"]').first()
  }

  cartCount() {
    return this.page.getByTestId('header-cart-count')
  }

  cartLink() {
    return this.page.getByTestId('header-link-cart')
  }
}
