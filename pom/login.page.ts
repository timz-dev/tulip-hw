import type { Page } from '@playwright/test';

export class LoginPage {
  private readonly selectors = {
    username: '#user-name',
    password: '#password',
    loginButton: '#login-button',
  };

  constructor(protected readonly page: Page) {}

  //#region Locators
  get usernameInput() {
    return this.page.locator(this.selectors.username);
  }

  get passwordInput() {
    return this.page.locator(this.selectors.password);
  }

  get loginButton() {
    return this.page.locator(this.selectors.loginButton);
  }
  //#endregion

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
