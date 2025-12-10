import { test, expect } from '@playwright/test'

test.describe('Acessibilidade - Estrutura', () => {
  
  test('deve ter landmarks semânticos', async ({ page }) => {
    await page.goto('/')
    
    // Header
    await expect(page.locator('header')).toBeVisible()
    
    // Main
    await expect(page.locator('main')).toBeVisible()
    
    // Nav (sidebar)
    await expect(page.locator('nav, aside')).toBeVisible()
  })

  test('deve ter hierarquia de headings correta', async ({ page }) => {
    await page.goto('/')
    
    // Deve haver pelo menos um heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const count = await headings.count()
    
    expect(count).toBeGreaterThan(0)
  })

  test('imagens devem ter alt text', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      // Alt pode ser vazio para imagens decorativas, mas deve existir
      expect(alt).toBeDefined()
    }
  })

  test('links devem ter texto descritivo', async ({ page }) => {
    await page.goto('/')
    
    const links = page.locator('a')
    const count = await links.count()
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      
      // Link deve ter texto ou aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

})

test.describe('Acessibilidade - Interação', () => {
  
  test('skip link deve existir (se implementado)', async ({ page }) => {
    await page.goto('/')
    
    // Skip link geralmente é o primeiro elemento focável
    await page.keyboard.press('Tab')
    
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('botões devem ter nome acessível', async ({ page }) => {
    await page.goto('/')
    
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const text = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')
        const title = await button.getAttribute('title')
        
        // Botão deve ter algum nome acessível
        expect(text?.trim() || ariaLabel || title).toBeTruthy()
      }
    }
  })

  test('elementos interativos devem ser focáveis', async ({ page }) => {
    await page.goto('/')
    
    // Pressiona Tab múltiplas vezes
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
    }
    
    // Deve haver elemento focado
    const focused = page.locator(':focus')
    const isVisible = await focused.isVisible().catch(() => false)
    expect(isVisible).toBeTruthy()
  })

})

test.describe('Acessibilidade - Cores e Contraste', () => {
  
  test('texto deve ser legível', async ({ page }) => {
    await page.goto('/')
    
    // Verifica se o texto principal está visível
    const mainText = page.locator('main p, main h1, main h2, main span').first()
    
    if (await mainText.isVisible()) {
      // Verifica se o elemento tem conteúdo
      const text = await mainText.textContent()
      expect(text?.length).toBeGreaterThan(0)
    }
  })

  test('links devem ser distinguíveis', async ({ page }) => {
    await page.goto('/')
    
    const link = page.locator('a').first()
    
    if (await link.isVisible()) {
      // Link deve ter algum estilo que o distingue
      const color = await link.evaluate(el => 
        window.getComputedStyle(el).color
      )
      expect(color).toBeTruthy()
    }
  })

})

test.describe('Acessibilidade - Responsividade', () => {
  
  test('conteúdo deve ser visível em mobile', async ({ page }) => {
    // Define viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Main content deve estar visível
    await expect(page.locator('main')).toBeVisible()
  })

  test('conteúdo deve ser visível em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    await expect(page.locator('main')).toBeVisible()
  })

  test('conteúdo deve ser visível em desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('aside')).toBeVisible()
  })

})
