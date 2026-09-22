import { test, expect } from '@playwright/test';

import { CartPage } from '../pom/cart.page';
import { CheckoutCompletePage } from '../pom/checkout-complete.page';
import { CheckoutStepOnePage } from '../pom/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pom/checkout-step-two.page';
import { InventoryPage } from '../pom/inventory.page';

test.describe('Automation Section - SauceDemo Tests', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory/);
  });

  test(
    'A user can add a few items to their cart and successfully purchase the items',
    { tag: '@test-1' },
    async ({ page }) => {
      const NR_ITEMS_TO_BUY = 3;
      await inventoryPage.addItemsToCart(NR_ITEMS_TO_BUY);
      await expect(inventoryPage.cartBadge).toHaveText(String(NR_ITEMS_TO_BUY));

      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart/);
      await expect(cartPage.cartItems).toHaveCount(NR_ITEMS_TO_BUY);

      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);

      await checkoutStepOnePage.fillInfo('Sauce', 'Test', '12345');
      await checkoutStepOnePage.continueToOverview();
      await expect(page).toHaveURL(/checkout-step-two/);

      await checkoutStepTwoPage.clickFinish();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    },
  );

  test(
    'A user can add at least 3 items to their cart, navigate to the cart, and remove an item. The existing items remain and the cart number correctly reflects the new count',
    { tag: '@test-2' },
    async ({ page }) => {
      const NR_ITEMS_TO_BUY = 3;
      const itemNames = await Promise.all(
        Array.from({ length: NR_ITEMS_TO_BUY }, (_, i) => inventoryPage.getItemName(i)),
      );

      await inventoryPage.addItemsToCart(NR_ITEMS_TO_BUY);
      await expect(inventoryPage.cartBadge).toHaveText(String(NR_ITEMS_TO_BUY));

      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart/);
      await expect(cartPage.cartItems).toHaveCount(NR_ITEMS_TO_BUY);
      await expect(cartPage.cartItemNames).toHaveText(itemNames);

      const [removedItem, ...remainingItems] = itemNames;
      await cartPage.removeItemByName(removedItem);

      await expect(cartPage.cartItems).toHaveCount(NR_ITEMS_TO_BUY - 1);
      await expect(inventoryPage.cartBadge).toHaveText(String(NR_ITEMS_TO_BUY - 1));
      await expect(cartPage.cartItemNames).toHaveText(remainingItems);
    },
  );

  test(
    'A user can sort items using the dropdown four different ways, each sorting method works as intended ',
    { tag: '@test-3' },
    async () => {
      await inventoryPage.selectSortOption('az');
      const namesAsc = await inventoryPage.itemNames.allTextContents();
      expect(namesAsc).toStrictEqual([...namesAsc].sort((a, b) => a.localeCompare(b)));

      await inventoryPage.selectSortOption('za');
      const namesDesc = await inventoryPage.itemNames.allTextContents();
      expect(namesDesc).toStrictEqual([...namesDesc].sort((a, b) => b.localeCompare(a)));

      const parsePrice = (text: string) => parseFloat(text.replace('$', ''));

      await inventoryPage.selectSortOption('lohi');
      const pricesAsc = (await inventoryPage.itemPrices.allTextContents()).map(parsePrice);
      expect(pricesAsc).toStrictEqual([...pricesAsc].sort((a, b) => a - b));

      await inventoryPage.selectSortOption('hilo');
      const pricesDesc = (await inventoryPage.itemPrices.allTextContents()).map(parsePrice);
      expect(pricesDesc).toStrictEqual([...pricesDesc].sort((a, b) => b - a));
    },
  );
});
