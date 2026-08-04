import { test, expect } from '@playwright/test';
import { login, signup } from './utils/auth';

function uniqueEmail() {
  const ts = Date.now();
  return `qa_user_${ts}@example.com`;
}

test.describe('Authentication', () => {
  test('User can sign up and then log in', async ({ page }) => {
    const email = uniqueEmail();
    const password = 'P@ssw0rd123!';

    await signup(page, { name: 'QA User', email, password });
    await login(page, { email, password });

    await expect(page.getByRole('link', { name: /employees/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
  });

  test('Unauthenticated user is redirected to login when accessing home', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });
});
