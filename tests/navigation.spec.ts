import { test, expect } from '@playwright/test';
import { signupAndLogin } from './utils/auth';

test.describe('Navigation', () => {
  test('Authenticated user can navigate to core modules', async ({ page }) => {
    await signupAndLogin(page);

    // index.html links every module twice (header nav + tile button), so scope to the header nav.
    const nav = page.locator('#nav');
    // Module pages only offer a "Back" link home, so each hop starts from index.
    const back = page.getByRole('link', { name: /back/i });

    await nav.getByRole('link', { name: 'Employees' }).click();
    await expect(page.getByRole('heading', { name: /manage employees/i })).toBeVisible();

    await back.click();
    await expect(nav.getByRole('link', { name: 'Employees' })).toBeVisible();

    await nav.getByRole('link', { name: 'Shifts' }).click();
    await expect(page.getByRole('heading', { name: /shift scheduling/i })).toBeVisible();
    await back.click();

    await nav.getByRole('link', { name: 'Attendance' }).click();
    await expect(page.getByRole('heading', { name: /attendance tracking/i })).toBeVisible();
    await back.click();

    await nav.getByRole('link', { name: 'Tasks' }).click();
    await expect(page.getByRole('heading', { name: /task assignment/i })).toBeVisible();
    await back.click();

    await nav.getByRole('link', { name: 'Performance' }).click();
    await expect(page.getByRole('heading', { name: /performance metrics dashboard/i })).toBeVisible();
  });
});
