import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  private readonly selectors = {
    inventoryItem: '.inventory_item',
    itemName: '.inventory_item_name',
    itemPrice: '.inventory_item_price',
    cartBadge: '.shopping_cart_badge',
    cartLink: '.shopping_cart_link',
    sortDropdown: '[data-test="product-sort-container"]',
  };

  constructor(page: Page) {
    this.page = page;
  }
  //#region Locators
  get inventoryItems(): Locator {
    return this.page.locator(this.selectors.inventoryItem);
  }

  get itemNames(): Locator {
    return this.page.locator(this.selectors.itemName);
  }

  get itemPrices(): Locator {
    return this.page.locator(this.selectors.itemPrice);
  }

  get cartBadge(): Locator {
    return this.page.locator(this.selectors.cartBadge);
  }

  get cartLink(): Locator {
    return this.page.locator(this.selectors.cartLink);
  }

  get sortDropdown(): Locator {
    return this.page.locator(this.selectors.sortDropdown);
  }
  //#endregion

  async addItemToCartByIndex(index: number) {
    await this.inventoryItems.nth(index).getByRole('button', { name: 'Add to cart' }).click();
  }

  async addItemsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addItemToCartByIndex(i);
    }
  }

  async getItemName(index: number): Promise<string> {
    return (await this.inventoryItems.nth(index).locator(this.selectors.itemName).innerText()).trim();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async selectSortOption(value: string) {
    await this.sortDropdown.selectOption(value);
  }
}
