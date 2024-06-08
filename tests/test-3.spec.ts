import { test, expect } from '@playwright/test';
import { User } from '../utils/user';
import { defineConfig } from '@playwright/test';

test('User is locked out from the platform', async ({ page, baseURL }) => {
  if (!baseURL) {
    throw new Error('Base URL is not defined in the configuration');
  }
  await page.goto('/');
  //Login with username, password
  const login = new User(page, 'locked_out_user', 'secret_sauce');
  await login.performLogin();
  //verify login fails
  await expect(page).toHaveURL(baseURL);
  //verify the customer is presented with error state
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});