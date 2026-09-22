import fs from 'fs';
import path from 'path';

import { chromium, type FullConfig } from '@playwright/test';

export const authFile = path.resolve(process.cwd(), 'playwright/.auth/standard_user.json');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(_: FullConfig) {
  const baseURL = process.env.BASE_URL;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);
  await page.locator('#user-name').fill(username!);
  await page.locator('#password').fill(password!);
  await page.locator('#login-button').click();
  await page.waitForURL(/inventory/);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  await browser.close();
}
