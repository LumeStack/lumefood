/**
 * auth.setup.ts
 *
 * Executa antes dos testes autenticados.
 * Faz login com o usuário joao@lumefood.com e persiste os cookies
 * em tests/.auth/user.json para reuso nos projetos dependentes.
 */
import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../.auth/user.json')

setup('autenticar usuário cliente', async ({ page }) => {
  await page.goto('/login')

  await page.getByTestId('login-input-email').fill('joao@lumefood.com')
  await page.getByTestId('login-input-password').fill('senha123')
  await page.getByTestId('login-button-submit').click()

  // Aguarda redirecionamento para home
  await page.waitForURL('/', { timeout: 15000 })
  await expect(page.getByTestId('header-button-logout')).toBeVisible()

  // Persiste sessão
  await page.context().storageState({ path: authFile })
})
