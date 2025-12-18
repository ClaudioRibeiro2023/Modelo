import { test, expect } from '@playwright/test'

test.describe('MVP Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TechDados/)
  })

  test('epi page loads with data', async ({ page }) => {
    await page.goto('/epi')
    await expect(page.locator('h1')).toContainText(/Epidemiologia|Epi/i)
    // Wait for data to load (mock or real)
    await page.waitForTimeout(1000)
    // Should show table or chart
    await expect(page.locator('table, [data-testid="chart"]').first()).toBeVisible()
  })

  test('ops page loads with data', async ({ page }) => {
    await page.goto('/ops')
    await expect(page.locator('h1')).toContainText(/Operação|Ops|Cobertura/i)
    await page.waitForTimeout(1000)
    await expect(page.locator('table, [data-testid="chart"]').first()).toBeVisible()
  })

  test('risk page loads with data', async ({ page }) => {
    await page.goto('/risk')
    await expect(page.locator('h1')).toContainText(/Risco|Risk/i)
    await page.waitForTimeout(1000)
    await expect(page.locator('table, [data-testid="chart"]').first()).toBeVisible()
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')

    // Navigate to epi
    await page.click('a[href="/epi"], [data-nav="epi"]')
    await expect(page).toHaveURL(/\/epi/)

    // Navigate to ops
    await page.click('a[href="/ops"], [data-nav="ops"]')
    await expect(page).toHaveURL(/\/ops/)

    // Navigate to risk
    await page.click('a[href="/risk"], [data-nav="risk"]')
    await expect(page).toHaveURL(/\/risk/)
  })

  test('territory filter is present', async ({ page }) => {
    await page.goto('/epi')
    // Check for territory filter component
    const filterExists = await page.locator('select, [data-testid="territory-filter"]').count()
    expect(filterExists).toBeGreaterThan(0)
  })
})

test.describe('BFF Health', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health')
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.status).toBeDefined()
  })

  test('api health endpoint responds', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/health')
    expect(response.ok()).toBeTruthy()
  })

  test('me endpoint responds', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/v1/me')
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.sub || body.user_id).toBeDefined()
  })
})
