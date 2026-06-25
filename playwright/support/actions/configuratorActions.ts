import { Page, expect } from '@playwright/test';

type ExteriorColorLabel = 'Glacier Blue' | 'Midnight Black' | 'Lunar White';
type WheelLabel = 'Aero Wheels' | 'Sport Wheels';
type ExteriorColorSlug = 'glacier-blue' | 'midnight-black' | 'lunar-white';
type WheelSlug = 'aero' | 'sport';

export function createConfiguratorActions(page: Page) {
  const totalPriceSection = page.getByTestId('total-price');

  return {
    elements: {
      totalPriceSection,
    },

    async open() {
      await page.goto('http://localhost:5173');
      await page.evaluate(() => localStorage.removeItem('velo-configurator-storage'));
      await page.getByRole('link', { name: 'Configure Agora' }).click();
      await expect(page).toHaveURL(/\/configure$/);
      await expect(page.getByRole('heading', { name: 'Velô Sprint', level: 1 })).toBeVisible();
    },

    async selectExteriorColor(color: ExteriorColorLabel) {
      await page.getByRole('button', { name: color }).click();
    },

    async selectWheelType(wheel: WheelLabel) {
      await page.getByRole('button', { name: new RegExp(wheel) }).click();
    },

    async expectTotalPrice(price: string) {
      await expect(totalPriceSection).toBeVisible()
      await expect(totalPriceSection).toHaveText(price);
    },

    async expectCarPreview(color: ExteriorColorSlug, wheel: WheelSlug) {
      const carImg = page.getByRole('img', { name: `Velô Sprint - ${color} with ${wheel} wheels` });
      await expect(carImg).toBeVisible();
      await expect(carImg).toHaveAttribute('src', `/src/assets/${color}-${wheel}-wheels.png`);
    },

    async toggleOptional(optionalTestId: 'opt-precision-park' | 'opt-flux-capacitor') {
      await page.getByTestId(optionalTestId).click();
    },

    async proceedToCheckout() {
      await page.getByTestId('checkout-button').click();
      await expect(page).toHaveURL(/\/order$/);
    },

    async expectCheckoutSummaryPrice(price: string) {
      const summaryPrice = page.getByTestId('summary-total-price');
      await expect(summaryPrice).toBeVisible();
      await expect(summaryPrice).toHaveText(price);
    }
  };
}
