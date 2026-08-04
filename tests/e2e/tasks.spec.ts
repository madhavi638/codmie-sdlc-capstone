import { test, expect } from '@playwright/test';
import { login, signup } from './utils/auth';

function uniqueEmail() {
  const ts = Date.now();
  return `qa_tasks_${ts}@example.com`;
}

async function ensureEmployeeExists(page) {
  // Create user + login
  const email = uniqueEmail();
  const password = 'P@ssw0rd123!';
  await signup(page, { name: 'QA Tasks', email, password });
  await login(page, { email, password });

  // Create employee (needed for tasks dropdown)
  await page.goto('/employees');
  const textInputs = page.locator('input[type="text"]');
  await textInputs.nth(0).fill(`Emp ${Date.now()}`);
  await textInputs.nth(1).fill('Analyst');
  await page.getByRole('button', { name: /add employee/i }).click();
}

test.describe('Tasks', () => {
  test('User can assign a task and see it in the task list', async ({ page }) => {
    await ensureEmployeeExists(page);

    await page.goto('/tasks');

    // Select first employee
    const employeeSelect = page.locator('select').first();
    await employeeSelect.selectOption({ index: 0 });

    const taskText = `Task ${Date.now()}`;
    await page.locator('input[type="text"]').first().fill(taskText);

    // status select likely exists (Pending/Completed). If not, try radio; but template implies options.
    const selects = page.locator('select');
    if (await selects.count() >= 2) {
      await selects.nth(1).selectOption({ label: 'Pending' });
    } else {
      // fallback to clicking the text "Pending" if implemented as radio/option
      const pending = page.getByText(/pending/i).first();
      if (await pending.isVisible()) await pending.click();
    }

    await page.getByRole('button', { name: /add task/i }).click();

    await expect(page.getByRole('table')).toContainText(taskText);
    await expect(page.getByRole('table')).toContainText(/pending|completed/i);
  });
});
