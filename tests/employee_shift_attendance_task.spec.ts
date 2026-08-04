import { test, expect } from '@playwright/test';
import { signupAndLogin } from './utils/auth';

// Routes defined in app.py: /employees, /shifts, /attendance, /tasks.
const modulePaths = ['/employees', '/shifts', '/attendance', '/tasks'];

test.describe('Module pages', () => {
  test('Employee, shift, attendance, and task pages load', async ({ page }) => {
    await signupAndLogin(page);

    for (const path of modulePaths) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      // A redirect to /login would also be a 200, so pin the resolved path too.
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });
});
