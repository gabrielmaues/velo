import { Page, expect } from '@playwright/test';

export function createCheckoutActions(page: Page) {
  const summaryTotalPrice = page.getByTestId('summary-total-price');

  return {
    elements: {
      summaryTotalPrice,
    },

    async expectSummaryPrice(price: string) {
      await expect(summaryTotalPrice).toBeVisible();
      await expect(summaryTotalPrice).toHaveText(price);
    },
  };
}
