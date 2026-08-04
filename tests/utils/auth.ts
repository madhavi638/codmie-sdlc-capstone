import { expect, Page } from '@playwright/test';
import { uniqueEmail, uniqueName } from './testData';

export async function signupAndLogin(page: Page, opts?: { password?: string }) {
  const password = opts?.password ?? 'Password123!';
  const email = uniqueEmail();
  const name = uniqueName();

  await page.goto('/signup');

  // Forms in templates do not expose stable selectors, so rely on common input types.
  await page.locator('input[type="text"]').first().fill(name);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').nth(0).fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);

  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForURL(/\/login/);

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /login/i }).click();

  await page.waitForURL(/\/$/);
  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();

  return { email, password, name };
}
