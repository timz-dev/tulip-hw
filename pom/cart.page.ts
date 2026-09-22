import type { Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  private readonly selectors = {
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
  };

  constructor(page: Page) {
    this.page = page;
  }
  //#region Locators
  get cartItems() {
    return this.page.locator(this.selectors.cartItem);
  }

  get cartItemNames() {
    return this.page.locator(this.selectors.cartItemName);
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name: 'Checkout' });
  }
  //#endregion

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async removeItemByName(name: string) {
    await this.cartItems.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }
}
