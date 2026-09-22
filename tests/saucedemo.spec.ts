import { test, expect } from '@playwright/test';

test('Test 1: A user can add a few items to their cart and successfully purchase the items', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/inventory/);
});
test(`Test 2: A user can add at least 3 items to their cart, navigate to the cart, and remove an 
item. The existing items remain and the cart number correctly reflects the new count`, async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/inventory/);
});
test('Test 3: A user can sort items using the dropdown four different ways, each sorting method works as intended ', async ({
  page,
}) => {
  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/inventory/);
});
