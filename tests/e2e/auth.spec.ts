/**
 * auth.spec.ts
 * Automação dos casos de teste CT-001 a CT-005 — Feature: Autenticação
 *
 * Todos os testes iniciam sem sessão ativa (browser limpo).
 */
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

// ─────────────────────────────────────────────────────────────────────────────
// CT-001 — Login com credenciais válidas
// ─────────────────────────────────────────────────────────────────────────────
test('CT-001 — Login com credenciais válidas', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('joao@lumefood.com', 'senha123')

  // Deve redirecionar para a home
  await expect(page).toHaveURL('/')

  // Header deve mostrar logout e carrinho (sessão estabelecida como CUSTOMER)
  await expect(page.getByTestId('header-button-logout')).toBeVisible()
  await expect(page.getByTestId('header-link-cart')).toBeVisible()
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-002 — Login com senha incorreta
// ─────────────────────────────────────────────────────────────────────────────
test('CT-002 — Login com senha incorreta', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('joao@lumefood.com', 'senhaerrada')

  // Deve permanecer na página de login
  await expect(page).toHaveURL(/\/login/)

  // Botão de logout NÃO deve aparecer (nenhuma sessão criada)
  await expect(page.getByTestId('header-button-logout')).not.toBeVisible()

  // Deve exibir alguma mensagem de erro
  const errorVisible = await page.locator('[data-sonner-toast]').isVisible().catch(() => false)
  const errorText = await page.locator('text=/incorret|inválid|senha|credencial/i').count()
  expect(errorVisible || errorText > 0).toBe(true)
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-003 — Registro de novo usuário
// ─────────────────────────────────────────────────────────────────────────────
test('CT-003 — Registro de novo usuário', async ({ page }) => {
  // E-mail único por execução para evitar conflito no banco compartilhado
  const uniqueEmail = `qa.teste.${Date.now()}@lumefood.com`

  const registerPage = new RegisterPage(page)
  await registerPage.goto()
  await registerPage.register('Usuário Teste', uniqueEmail, 'Senha@123')

  // O sistema redireciona para /login após criar a conta
  // (o usuário precisa fazer login manualmente após o cadastro)
  await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

  // Toast de sucesso deve aparecer confirmando criação da conta
  await expect(
    page.locator('text=/conta criada|sucesso|faça login/i')
  ).toBeVisible({ timeout: 8000 })
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-004 — Registro com e-mail já cadastrado
// ─────────────────────────────────────────────────────────────────────────────
test('CT-004 — Registro com e-mail já cadastrado', async ({ page }) => {
  const registerPage = new RegisterPage(page)

  await registerPage.goto()
  // joao@lumefood.com está no seed — já existe no banco
  await registerPage.register('Qualquer Nome', 'joao@lumefood.com', '123456')

  // Deve permanecer na página de registro
  await expect(page).toHaveURL(/\/register/)

  // Nenhuma sessão deve ser criada
  await expect(page.getByTestId('header-button-logout')).not.toBeVisible()

  // A API retorna "Email já cadastrado" — deve aparecer como toast de erro
  await expect(
    page.locator('text=/Email já cadastrado|e-mail já cadastrad/i')
  ).toBeVisible({ timeout: 8000 })
})

// ─────────────────────────────────────────────────────────────────────────────
// CT-005 — Proteção de rota autenticada
// ─────────────────────────────────────────────────────────────────────────────
test('CT-005 — Proteção de rota autenticada', async ({ page }) => {
  // Acessa /checkout diretamente sem sessão
  await page.goto('/checkout')

  // Deve ser redirecionado para /login
  await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

  // Formulário de login deve estar visível (página de checkout não exibida)
  await expect(page.getByTestId('login-form')).toBeVisible()
})
