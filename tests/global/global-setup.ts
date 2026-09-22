import fs from 'fs';
import path from 'path';

import { chromium, type FullConfig } from '@playwright/test';

import type { Credentials } from '../../types/data';

export const authFile = path.resolve(process.cwd(), 'playwright/.auth/standard_user.json');

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL;
  const { usernames, password }: Credentials = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'data/credentials.json'), 'utf-8'),
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);
  await page.locator('#user-name').fill(usernames[0]);
  await page.locator('#password').fill(password);
  await page.locator('#login-button').click();
  await page.waitForURL(/inventory/);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  await browser.close();
}
