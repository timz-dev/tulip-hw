import type { Locator, Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //#region Locators
  get finishButton(): Locator {
    return this.page.getByRole('button', { name: 'Finish' });
  }
  //#endregion

  async clickFinish() {
    await this.finishButton.click();
  }
}
