import { test, expect } from '@playwright/test';
import { login, signup } from './utils/auth';

function uniqueEmail() {
  const ts = Date.now();
  return `qa_nav_${ts}@example.com`;
}

test.describe('Navigation', () => {
  test('Logged in user can navigate to main modules', async ({ page }) => {
    const email = uniqueEmail();
    const password = 'P@ssw0rd123!';
    await signup(page, { name: 'QA Nav', email, password });
    await login(page, { email, password });

    await page.getByRole('link', { name: /employees/i }).click();
    await expect(page).toHaveURL(/\/employees$/);

    await page.goto('/');
    await page.getByRole('link', { name: /shifts/i }).click();
    await expect(page).toHaveURL(/\/shifts$/);

    await page.goto('/');
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page).toHaveURL(/\/attendance$/);

    await page.goto('/');
    await page.getByRole('link', { name: /tasks/i }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.goto('/');
    await page.getByRole('link', { name: /performance/i }).click();
    await expect(page).toHaveURL(/\/performance$/);

    await expect(page.getByText(/performance metrics dashboard/i)).toBeVisible();
  });
});
