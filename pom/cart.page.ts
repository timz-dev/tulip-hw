import type { Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  private readonly selectors = {
    cartItem: '.cart_item',
  };

  constructor(page: Page) {
    this.page = page;
  }
  //#region Locators
  get cartItems() {
    return this.page.locator(this.selectors.cartItem);
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name: 'Checkout' });
  }
  //#endregion

  async checkout() {
    await this.checkoutButton.click();
  }
}
