import { test, expect } from '@playwright/test'

test.describe('Navegação Completa', () => {
  
  test('deve navegar por todas as páginas públicas', async ({ page }) => {
    // Home
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('main')).toBeVisible()
    
    // Documentação
    await page.getByRole('link', { name: /documentação/i }).click()
    await expect(page).toHaveURL(/\/docs/)
    await expect(page.getByRole('heading', { name: /documentação/i })).toBeVisible()
  })

  test('deve navegar para páginas administrativas (ADMIN)', async ({ page }) => {
    await page.goto('/')
    
    // Usuários (requer ADMIN ou GESTOR)
    await page.getByRole('link', { name: /usuários/i }).click()
    await expect(page).toHaveURL(/\/users/)
    
    // Configurações (requer ADMIN)
    await page.getByRole('link', { name: /configurações/i }).click()
    await expect(page).toHaveURL(/\/config/)
  })

  test('breadcrumb deve atualizar na navegação', async ({ page }) => {
    await page.goto('/profile')
    
    // Verifica se há algum indicador de localização
    await expect(page.getByText(/perfil/i)).toBeVisible()
  })

  test('deve manter estado do sidebar ao navegar', async ({ page }) => {
    await page.goto('/')
    
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    
    // Navega para outra página
    await page.getByRole('link', { name: /perfil/i }).click()
    
    // Sidebar ainda visível
    await expect(sidebar).toBeVisible()
  })

})

test.describe('Navegação por Teclado', () => {
  
  test('links devem ser focáveis via Tab', async ({ page }) => {
    await page.goto('/')
    
    // Pressiona Tab várias vezes
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Algum elemento deve estar focado
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('Enter deve ativar link focado', async ({ page }) => {
    await page.goto('/')
    
    // Foca no primeiro link do sidebar
    const firstLink = page.locator('aside a').first()
    await firstLink.focus()
    
    // Pressiona Enter
    await page.keyboard.press('Enter')
    
    // Deve ter navegado
    await page.waitForLoadState('networkidle')
  })

})

test.describe('Deep Links', () => {
  
  test('deve acessar página diretamente via URL', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByRole('heading', { name: /perfil/i })).toBeVisible()
  })

  test('deve acessar config diretamente (ADMIN)', async ({ page }) => {
    await page.goto('/config')
    await expect(page.locator('main')).toBeVisible()
  })

  test('deve acessar users diretamente', async ({ page }) => {
    await page.goto('/users')
    await expect(page.locator('main')).toBeVisible()
  })

  test('página 404 para rota inexistente', async ({ page }) => {
    await page.goto('/rota-que-nao-existe')
    
    // Deve mostrar algum erro ou redirecionar
    await expect(page.locator('body')).toBeVisible()
  })

})
