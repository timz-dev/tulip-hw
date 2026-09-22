import type { Locator, Page } from '@playwright/test';

export class CheckoutStepOnePage {
  readonly page: Page;
  private readonly selectors = {
    firstName: '#first-name',
    lastName: '#last-name',
    postalCode: '#postal-code',
  };

  constructor(page: Page) {
    this.page = page;
  }

  //#region Locators
  get firstNameInput(): Locator {
    return this.page.locator(this.selectors.firstName);
  }

  get lastNameInput(): Locator {
    return this.page.locator(this.selectors.lastName);
  }

  get postalCodeInput(): Locator {
    return this.page.locator(this.selectors.postalCode);
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }
  //#endregion

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }
}
