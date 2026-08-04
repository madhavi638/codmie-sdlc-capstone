import { test, expect } from '@playwright/test';
import { signupAndLogin } from './utils/auth';
import { uniqueEmployee } from './utils/testData';

// NOTE: The current UI templates shown in repo search appear to be rendered as Markdown-like content
// and lack stable form field attributes in the extracted view.
// These tests use resilient selectors (role + text + first matching inputs/selects).

test.describe('Core CRUD flows', () => {
  test('User can add employee, assign shift, record attendance, and add task', async ({ page }) => {
    await signupAndLogin(page);

    const employeeName = uniqueEmployee('Emp');
    const position = 'Engineer';

    // Employees - add
    await page.goto('/employees');
    await expect(page.getByRole('heading', { name: /manage employees/i })).toBeVisible();

    const employeeInputs = page.locator('form input');
    // best-effort fill: name then position
    await employeeInputs.nth(0).fill(employeeName);
    await employeeInputs.nth(1).fill(position);
    await page.getByRole('button', { name: /add employee/i }).click();
    await page.waitForURL(/\/employees/);
    await expect(page.getByText(employeeName)).toBeVisible();

    // Shifts - add shift for the created employee
    await page.goto('/shifts');
    await expect(page.getByRole('heading', { name: /shift scheduling/i })).toBeVisible();

    // select employee by visible name
    const employeeSelect = page.locator('select').first();
    await employeeSelect.selectOption({ label: employeeName });

    // shift time input
    const shiftTimeInput = page.locator('form input').first();
    await shiftTimeInput.fill('09:00-17:00');

    await page.getByRole('button', { name: /add shift/i }).click();
    await page.waitForURL(/\/shifts/);
    await expect(page.getByText(employeeName)).toBeVisible();
    await expect(page.getByText('09:00-17:00')).toBeVisible();

    // Attendance - add attendance
    await page.goto('/attendance');
    await expect(page.getByRole('heading', { name: /attendance tracking/i })).toBeVisible();

    const attendanceEmployeeSelect = page.locator('select').first();
    await attendanceEmployeeSelect.selectOption({ label: employeeName });

    // date input
    const dateInput = page.locator('input[type="date"], form input').first();
    // some templates may not use type=date; fallback fills any first form input after select
    await dateInput.fill('2026-08-04');

    const statusSelectOrRadio = page.locator('select').nth(1);
    if (await statusSelectOrRadio.count()) {
      await statusSelectOrRadio.selectOption({ label: 'Present' });
    } else {
      const presentRadio = page.getByLabel(/present/i);
      if (await presentRadio.count()) await presentRadio.check();
    }

    await page.getByRole('button', { name: /add attendance/i }).click();
    await page.waitForURL(/\/attendance/);
    await expect(page.getByText(employeeName)).toBeVisible();
    await expect(page.getByText('2026-08-04')).toBeVisible();

    // Tasks - add task
    await page.goto('/tasks');
    await expect(page.getByRole('heading', { name: /task assignment/i })).toBeVisible();

    const tasksEmployeeSelect = page.locator('select').first();
    await tasksEmployeeSelect.selectOption({ label: employeeName });

    const taskText = 'Complete onboarding';
    const taskInput = page.locator('form input').first();
    await taskInput.fill(taskText);

    const taskStatusSelect = page.locator('select').nth(1);
    if (await taskStatusSelect.count()) {
      await taskStatusSelect.selectOption({ label: 'Pending' });
    }

    await page.getByRole('button', { name: /add task/i }).click();
    await page.waitForURL(/\/tasks/);
    await expect(page.getByText(employeeName)).toBeVisible();
    await expect(page.getByText(taskText)).toBeVisible();
  });
});
