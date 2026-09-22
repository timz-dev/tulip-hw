import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;

  private readonly selectors = {
    completeHeader: '.complete-header',
  };

  constructor(page: Page) {
    this.page = page;
  }
  //#region Locators
  get completeHeader(): Locator {
    return this.page.locator(this.selectors.completeHeader);
  }
  //#endregion
}
