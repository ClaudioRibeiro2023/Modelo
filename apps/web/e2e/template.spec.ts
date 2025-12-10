import { test, expect } from '@playwright/test'

test.describe('Template - Validação Base', () => {
  
  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/')
    
    // Verifica se o título ou conteúdo principal está presente
    await expect(page.locator('body')).toBeVisible()
  })

  test('deve exibir o sidebar', async ({ page }) => {
    await page.goto('/')
    
    // Aguarda sidebar estar visível
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    
    // Verifica se tem o logo/título
    await expect(sidebar.getByText('Template')).toBeVisible()
  })

  test('deve navegar para página de perfil', async ({ page }) => {
    await page.goto('/')
    
    // Clica no link de perfil no sidebar
    await page.getByRole('link', { name: /perfil/i }).click()
    
    // Verifica URL
    await expect(page).toHaveURL(/\/profile/)
    
    // Verifica conteúdo da página
    await expect(page.getByRole('heading', { name: /meu perfil/i })).toBeVisible()
  })

  test('deve navegar para página de exemplo', async ({ page }) => {
    await page.goto('/')
    
    // Clica no link de exemplo
    await page.getByRole('link', { name: /exemplo/i }).click()
    
    // Verifica URL
    await expect(page).toHaveURL(/\/example/)
  })

  test('demo mode deve mostrar usuário autenticado', async ({ page }) => {
    await page.goto('/profile')
    
    // Em demo mode, o usuário deve estar autenticado
    await expect(page.getByText('Demo User')).toBeVisible()
    await expect(page.getByText('demo@template.com')).toBeVisible()
  })

  test('demo mode deve ter todas as roles', async ({ page }) => {
    await page.goto('/profile')
    
    // Em demo mode, todas as roles devem estar presentes
    await expect(page.getByText('ADMIN')).toBeVisible()
    await expect(page.getByText('GESTOR')).toBeVisible()
  })

})

test.describe('Template - Layout e Responsividade', () => {
  
  test('header deve estar presente', async ({ page }) => {
    await page.goto('/')
    
    // Header deve existir
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('main content deve estar presente', async ({ page }) => {
    await page.goto('/')
    
    // Main content area
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

})

test.describe('Template - Autenticação Demo', () => {
  
  test('sidebar deve ter botão de logout', async ({ page }) => {
    await page.goto('/')
    
    // Botão de sair deve estar no sidebar
    const logoutButton = page.getByRole('button', { name: /sair/i })
    await expect(logoutButton).toBeVisible()
  })

  test('configurações só visível para ADMIN', async ({ page }) => {
    // Em demo mode com todas as roles, deve ver configurações
    await page.goto('/')
    
    const settingsLink = page.getByRole('link', { name: /configurações/i })
    await expect(settingsLink).toBeVisible()
  })

})
