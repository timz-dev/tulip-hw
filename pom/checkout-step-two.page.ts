import type { Locator, Page } from '@playwright/test';

export class CheckoutStepTwoPage {
  constructor(protected readonly page: Page) {}

  //#region Locators
  get finishButton(): Locator {
    return this.page.getByRole('button', { name: 'Finish' });
  }
  //#endregion

  async clickFinish() {
    await this.finishButton.click();
  }
}
