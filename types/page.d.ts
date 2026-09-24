import type { InventoryPage } from '../pom/inventory.page';
import type { CartPage } from '../pom/cart.page';
import type { CheckoutStepOnePage } from '../pom/checkout-step-one.page';
import type { CheckoutStepTwoPage } from '../pom/checkout-step-two.page';
import type { CheckoutCompletePage } from '../pom/checkout-complete.page';

export type SauceTestPages = {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
