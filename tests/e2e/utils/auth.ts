import { Page, expect } from '@playwright/test';

export async function signup(page: Page, opts: { name: string; email: string; password: string }) {
  await page.goto('/signup');

  // Forms have minimal markup; fall back to generic placeholders/labels by input type.
  await page.locator('input[type="text"]').first().fill(opts.name);
  await page.locator('input[type="email"]').first().fill(opts.email);
  const pw = page.locator('input[type="password"]');
  await pw.nth(0).fill(opts.password);
  await pw.nth(1).fill(opts.password);

  await page.getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/login$/);
}

export async function login(page: Page, opts: { email: string; password: string }) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(opts.email);
  await page.locator('input[type="password"]').fill(opts.password);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/$/);
}
