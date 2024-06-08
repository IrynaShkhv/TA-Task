import { test, expect } from '@playwright/test';
import { User } from '../utils/user';
import { Inventory } from '../utils/inventory';

test('Customer sorts product items', async ({ page }) => {
  await page.goto('/');
  //Login with username, password
  const login = new User(page, 'standard_user', 'secret_sauce');
  await login.performLogin();
  //Check that login is successfull
  await expect(page).toHaveURL(/.*inventory\.html$/);
  //verify that sorting works
  const verifySorting = new Inventory(page, 0);
  await verifySorting.verifySortingZA();
  await verifySorting.verifySortingAZ();
  await verifySorting.verifySortingPriceLoHi();
  await verifySorting.verifySortingPriceHiLo();
});