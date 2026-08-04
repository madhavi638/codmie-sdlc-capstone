import { test, expect } from '@playwright/test';
import { signupAndLogin } from './utils/auth';

test.describe('Navigation', () => {
  test('Authenticated user can navigate to core modules', async ({ page }) => {
    await signupAndLogin(page);

    await page.getByRole('link', { name: /employees/i }).click();
    await expect(page.getByRole('heading', { name: /manage employees/i })).toBeVisible();

    await page.getByRole('link', { name: /back/i }).click();
    await expect(page.getByRole('link', { name: /employees/i })).toBeVisible();

    await page.getByRole('link', { name: /shifts/i }).click();
    await expect(page.getByRole('heading', { name: /shift scheduling/i })).toBeVisible();

    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page.getByRole('heading', { name: /attendance tracking/i })).toBeVisible();

    await page.getByRole('link', { name: /tasks/i }).click();
    await expect(page.getByRole('heading', { name: /task assignment/i })).toBeVisible();

    await page.getByRole('link', { name: /performance/i }).click();
    await expect(page.getByRole('heading', { name: /performance metrics dashboard/i })).toBeVisible();
  });
});
