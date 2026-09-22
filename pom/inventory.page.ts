import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  private readonly selectors = {
    inventoryItem: '.inventory_item',
    cartBadge: '.shopping_cart_badge',
    cartLink: '.shopping_cart_link',
  };

  constructor(page: Page) {
    this.page = page;
  }
  //#region Locators
  get inventoryItems(): Locator {
    return this.page.locator(this.selectors.inventoryItem);
  }

  get cartBadge(): Locator {
    return this.page.locator(this.selectors.cartBadge);
  }

  get cartLink(): Locator {
    return this.page.locator(this.selectors.cartLink);
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

  async goToCart() {
    await this.cartLink.click();
  }
}
