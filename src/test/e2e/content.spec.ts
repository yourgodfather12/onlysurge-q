import { test, expect } from '@playwright/test';

test.describe('Content Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/signin');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should allow uploading content', async ({ page }) => {
    await page.goto('/content');
    
    // Upload file
    await page.setInputFiles('input[type="file"]', 'test-file.jpg');
    await page.fill('input[placeholder="Enter a title"]', 'Test Content');
    await page.fill('textarea', 'Test description');
    await page.click('button:has-text("Upload")');

    await expect(page.locator('text=Content uploaded successfully')).toBeVisible();
  });

  test('should show content analytics', async ({ page }) => {
    await page.goto('/content');
    
    await page.click('text=Test Content');
    await page.click('button:has-text("Analyze")');

    await expect(page.locator('text=AI Analysis')).toBeVisible();
    await expect(page.locator('text=Engagement Score')).toBeVisible();
  });
});