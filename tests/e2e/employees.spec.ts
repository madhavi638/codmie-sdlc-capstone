import { test, expect } from '@playwright/test';
import { login, signup } from './utils/auth';

function uniqueEmail() {
  const ts = Date.now();
  return `qa_emp_${ts}@example.com`;
}

async function ensureLoggedIn(page) {
  const email = uniqueEmail();
  const password = 'P@ssw0rd123!';
  await signup(page, { name: 'QA Emp', email, password });
  await login(page, { email, password });
}

test.describe('Employees', () => {
  test('User can add an employee and see it in the list', async ({ page }) => {
    await ensureLoggedIn(page);

    await page.goto('/employees');

    // employees.html is minimal; assume first two text inputs are name + position.
    const name = `Emp ${Date.now()}`;
    const position = 'Engineer';

    const textInputs = page.locator('input[type="text"]');
    await textInputs.nth(0).fill(name);
    await textInputs.nth(1).fill(position);

    await page.getByRole('button', { name: /add employee/i }).click();

    // Verify row contains employee name + position.
    await expect(page.getByRole('table')).toContainText(name);
    await expect(page.getByRole('table')).toContainText(position);
  });
});
