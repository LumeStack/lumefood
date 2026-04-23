import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1, // Execução sequencial: todos os testes usam o mesmo usuário no banco compartilhado
  retries: process.env.CI ? 1 : 0,
  timeout: 40000,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://lumefood.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // Cria o estado de autenticação salvo em disco
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Testes de autenticação: sem storageState (precisam de browser limpo)
    {
      name: 'auth',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Testes de carrinho e checkout: usam sessão autenticada persistida
    {
      name: 'authenticated',
      testMatch: /(carrinho|checkout)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/user.json', // gerado por auth.setup.ts
      },
      dependencies: ['setup'],
    },
  ],
})
