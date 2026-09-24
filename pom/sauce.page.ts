import { test as base } from '@playwright/test';

import { SauceTestPages } from '../types/page';

import { InventoryPage } from './inventory.page';
import { CartPage } from './cart.page';
import { CheckoutStepOnePage } from './checkout-step-one.page';
import { CheckoutStepTwoPage } from './checkout-step-two.page';
import { CheckoutCompletePage } from './checkout-complete.page';

export const sauceTest = base.extend<SauceTestPages>({
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});
