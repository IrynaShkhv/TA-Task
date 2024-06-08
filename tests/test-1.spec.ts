import { test, expect } from '@playwright/test';
import { User } from '../utils/user';
import { Inventory } from '../utils/inventory';

test('Customer purchases products', async ({ page }) => {
  await page.goto('/');
  //Login with username, password
  const login = new User(page, 'standard_user', 'secret_sauce');
  await login.performLogin();
   //Check that login is successfull
  await expect(page).toHaveURL(/.*inventory\.html$/);
  //add random items
  const numberOfItemsToAdd = 2;
  const addRandomItems = new Inventory(page, numberOfItemsToAdd);
  await addRandomItems.addRandomItemsToCart();
  //go to cart
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/.*cart\.html$/);
  //Verify items are in the cart, as site allow checkout with empty cart
  await addRandomItems.verifyItemsInCart(numberOfItemsToAdd);
  //go to checkout
  await page.locator('[data-test="checkout"]').click();
  //Fill random user info
  const fillRandomUserInfo = new User(page, 'standard_user', 'secret_sauce');
  await fillRandomUserInfo.fillRandomUserInfo();
  //go to 2nd checkout step
  await page.locator('[data-test="continue"]').click();
  await expect(page).toHaveURL(/.*checkout-step-two\.html$/);
  await page.locator('[data-test="finish"]').click();
  // Verify that purchase is completed
  await expect(page).toHaveURL(/.*checkout-complete\.html$/);
  await expect(page.locator('[data-test="title"]')).toBeVisible();
  await expect(page.locator('text=Thank you for your order!')).toBeVisible();
});