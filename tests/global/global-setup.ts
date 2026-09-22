import fs from 'fs';
import path from 'path';

import { chromium, type FullConfig } from '@playwright/test';

import { LoginPage } from '../../pom/login.page';

export const authFile = path.resolve(process.cwd(), 'playwright/.auth/standard_user.json');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(_: FullConfig) {
  const baseURL = process.env.BASE_URL;
  const username = process.env.STANDARD_USER;
  const password = process.env.PASSWORD;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);
  const loginPage = new LoginPage(page);
  await loginPage.login(username!, password!);
  await page.waitForURL(/inventory/);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  await browser.close();
}
