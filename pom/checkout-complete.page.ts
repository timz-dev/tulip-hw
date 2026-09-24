import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly selectors = {
    completeHeader: '.complete-header',
  };

  constructor(protected readonly page: Page) {}

  //#region Locators
  get completeHeader(): Locator {
    return this.page.locator(this.selectors.completeHeader);
  }
  //#endregion
}
