/**
 * helpers/cart.ts
 *
 * Funções utilitárias para configuração do carrinho via API,
 * evitando cliques repetidos na UI e acelerando o setup dos testes.
 */
import { Page } from '@playwright/test'

/**
 * Limpa o carrinho do usuário autenticado via API.
 */
export async function clearCart(page: Page): Promise<void> {
  const res = await page.request.delete('/api/carrinho')
  // Aceita 200 (deletado) ou 404 (já estava vazio)
  if (!res.ok() && res.status() !== 404) {
    throw new Error(`Falha ao limpar carrinho: ${res.status()}`)
  }
}

/**
 * Retorna a lista de restaurantes disponíveis.
 */
export async function getRestaurants(page: Page) {
  const res = await page.request.get('/api/restaurantes')
  return res.json() as Promise<Array<{ id: string; name: string; isOpen: boolean; minimumOrder: number }>>
}

/**
 * Retorna os itens do cardápio de um restaurante.
 * A API retorna diretamente um array de categorias (não { categories: [] }).
 */
export async function getMenuItems(page: Page, restaurantId: string) {
  const res = await page.request.get(`/api/restaurantes/${restaurantId}/cardapio`)
  const categories = await res.json() as Array<{ items: Array<{ id: string; name: string; price: number }> }>
  return categories.flatMap((cat) => cat.items)
}

/**
 * Adiciona um item ao carrinho via API.
 */
export async function addItemToCart(page: Page, menuItemId: string, quantity = 1): Promise<void> {
  const res = await page.request.post('/api/carrinho/items', {
    data: { menuItemId, quantity },
  })
  if (!res.ok()) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Falha ao adicionar item: ${res.status()} ${JSON.stringify(body)}`)
  }
}

/**
 * Prepara o carrinho para testes de checkout com item acima do pedido mínimo.
 * Usa Frango Grelhado (R$30) do FrangoGrill (mínimo R$20).
 */
export async function setupCartAboveMinimum(page: Page): Promise<void> {
  await clearCart(page)
  const restaurants = await getRestaurants(page)
  const frangoGrill = restaurants.find((r) => r.name === 'FrangoGrill')
  if (!frangoGrill) throw new Error('Restaurante FrangoGrill não encontrado')

  const items = await getMenuItems(page, frangoGrill.id)
  const frangoGrelhado = items.find((i) => i.name === 'Frango Grelhado')
  if (!frangoGrelhado) throw new Error('Item Frango Grelhado não encontrado')

  await addItemToCart(page, frangoGrelhado.id, 1)
}

/**
 * Prepara o carrinho com item abaixo do pedido mínimo.
 * Usa Suco de Laranja (R$9) da Bella Napoli (mínimo R$25).
 */
export async function setupCartBelowMinimum(page: Page): Promise<void> {
  await clearCart(page)
  const restaurants = await getRestaurants(page)
  const bellaNapoli = restaurants.find((r) => r.name === 'Bella Napoli Pizza')
  if (!bellaNapoli) throw new Error('Restaurante Bella Napoli não encontrado')

  const items = await getMenuItems(page, bellaNapoli.id)
  const suco = items.find((i) => i.name === 'Suco de Laranja')
  if (!suco) throw new Error('Item Suco de Laranja não encontrado')

  await addItemToCart(page, suco.id, 1)
}

/**
 * Prepara o carrinho com item de restaurante FECHADO (Pizza Express).
 */
export async function setupCartClosedRestaurant(page: Page): Promise<void> {
  await clearCart(page)
  const restaurants = await getRestaurants(page)
  const pizzaExpress = restaurants.find((r) => r.name === 'Pizza Express')
  if (!pizzaExpress) throw new Error('Restaurante Pizza Express não encontrado')

  const items = await getMenuItems(page, pizzaExpress.id)
  const firstItem = items[0]
  if (!firstItem) throw new Error('Nenhum item encontrado no Pizza Express')

  await addItemToCart(page, firstItem.id, 1)
}
