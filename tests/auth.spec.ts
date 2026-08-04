import { test, expect } from '@playwright/test';
import { signupAndLogin } from './utils/auth';

test.describe('Authentication', () => {
  test('User can sign up, log in, and log out', async ({ page }) => {
    await signupAndLogin(page);

    await page.getByRole('link', { name: /logout/i }).click();
    await page.waitForURL(/\/login/);

    // After logout, trying to go home should redirect to login due to login_required.
    await page.goto('/');
    await page.waitForURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });
});
