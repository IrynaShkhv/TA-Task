import { Page, expect } from '@playwright/test';

export class Inventory {
  private page: Page;
  private numberOfItems: number;

  constructor(page: Page, numberOfItems: number) {
    this.page = page;
    this.numberOfItems = numberOfItems;
  }

  async addRandomItemsToCart() {
    // Count all "Add to cart" buttons
    const addToCartButtons = await this.page.$$('[data-test^="add-to-cart-"]');
    // Ensure there are enough items available
    if (addToCartButtons.length < this.numberOfItems) {
      throw new Error(`Less than ${this.numberOfItems} items available to add to cart.`);
    }
    // Generate distinct random indices
    const indices = new Set<number>();
    while (indices.size < this.numberOfItems) {
      indices.add(Math.floor(Math.random() * addToCartButtons.length));
    }
    // Click on the "Add to cart" buttons for the selected indices
    for (const index of indices) {
      await addToCartButtons[index].click();
    }
    // Verify the items were added to the cart
    const cartItems = await this.page.$$('[data-test^="remove-"]');
    expect(cartItems.length).toBeGreaterThanOrEqual(this.numberOfItems);
  }
  async verifyItemsInCart(expectedItemCount: number) {
    // Select all cart items
    const cartItems = await this.page.$$('[data-test="inventory-item"]');
    // Verify the number of items in the cart
    expect(cartItems.length).toBe(expectedItemCount);
  }
  async verifySortingZA() {
    // Select Z-A sorting option
    await this.page.locator('[data-test="product-sort-container"]').selectOption('za');
    // Get all item names after sorting
    const itemNames = await this.page.$$eval('[data-test="inventory-item-name"]', items => 
      items.map(item => item.textContent?.trim() || '')
    );
    // Create a sorted copy of the item names in Z-A order
    const sortedItemNames = [...itemNames].sort().reverse();
    // Verify that the item names match the Z-A sorted order
    expect(itemNames).toEqual(sortedItemNames);
  }
  async verifySortingAZ() {
    // Select A-Z sorting option
    await this.page.locator('[data-test="product-sort-container"]').selectOption('az');
    // Get all item names after sorting
    const itemNames = await this.page.$$eval('[data-test="inventory-item-name"]', items => 
      items.map(item => item.textContent?.trim() || '')
    );
    // Create a sorted copy of the item names in A-Z order
    const sortedItemNames = [...itemNames].sort();
    // Verify that the item names match the A-Z sorted order
    expect(itemNames).toEqual(sortedItemNames);
  }
  async verifySortingPriceLoHi() {
    // Select Lo-Hi sorting option
    await this.page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    // Get all item prices after sorting
    const itemPrices = await this.page.$$eval('[data-test="inventory-item-price"]', items => 
      items.map(item => parseFloat(item.textContent?.replace('$', '') || '0'))
    );
    // Create a sorted copy of the item prices in ascending order
    const sortedItemPrices = [...itemPrices].sort((a, b) => a - b);
    // Verify that the item prices match the sorted order
    expect(itemPrices).toEqual(sortedItemPrices);
  }
  async verifySortingPriceHiLo() {
    // Select Lo-Hi sorting option
    await this.page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    // Get all item prices after sorting
    const itemPrices = await this.page.$$eval('[data-test="inventory-item-price"]', items => 
      items.map(item => parseFloat(item.textContent?.replace('$', '') || '0'))
    );
    // Create a sorted copy of the item prices in ascending order
    const sortedItemPrices = [...itemPrices].sort((a, b) => a - b).reverse();
    // Verify that the item prices match the sorted order
    expect(itemPrices).toEqual(sortedItemPrices);
  }
}
