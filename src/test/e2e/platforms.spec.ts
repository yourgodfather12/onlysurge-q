import { test, expect } from '@playwright/test';

test.describe('Platform Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should connect to platforms', async ({ page }) => {
    await page.goto('/integrations');
    
    // Connect to Fansly
    await page.click('button:has-text("Connect"):near(:text("Fansly"))');
    await expect(page.locator('text=Connected to Fansly')).toBeVisible();

    // Show OnlyFans manual connection warning
    await page.click('button:has-text("Connect"):near(:text("OnlyFans"))');
    await expect(page.locator('text=Manual Connection Required')).toBeVisible();
  });

  test('should show platform analytics', async ({ page }) => {
    await page.goto('/analytics');
    
    await expect(page.locator('text=Platform Performance')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Subscribers')).toBeVisible();
  });
});