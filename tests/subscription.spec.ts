import { test, expect } from '../src/fixtures/baseTest';

const SUBSCRIPTION_SUCCESS_TEXT = 'You have been successfully subscribed!';

test.describe('Subscription Tests (TC10, TC11)', () => {

    test('TC10: Subscribe via footer on home page', async ({ homePage }) => {
        // 1. Open home page
        await homePage.navigate();

        // 2. Scroll to footer so subscription form is in view
        await homePage.scrollToFooter();

        // 3. Verify 'SUBSCRIPTION' header is visible
        await expect(homePage.subscriptionHeader).toBeVisible();

        // 4. Submit a unique email to avoid stale-state false positives
        await homePage.subscribe(`subscriber_${Date.now()}@test.com`);

        // 5. Success alert should appear
        await expect(homePage.subscriptionSuccessMessage).toBeVisible();
        await expect(homePage.subscriptionSuccessMessage).toContainText(SUBSCRIPTION_SUCCESS_TEXT);
    });

    test('TC11: Subscribe via footer on cart page', async ({ homePage, productsPage, page }) => {
        // 1. Open home page
        await homePage.navigate();

        // 2. Navigate to cart via the header link (cart is empty here, fine for TC11)
        await homePage.cartLink.click();
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 3. Scroll to footer; subscription block lives in the global footer
        await homePage.scrollToFooter();
        await expect(homePage.subscriptionHeader).toBeVisible();

        // 4. Submit subscription form
        await homePage.subscribe(`cart_subscriber_${Date.now()}@test.com`);

        // 5. Verify success alert renders inside the cart-page footer
        await expect(homePage.subscriptionSuccessMessage).toBeVisible();
        await expect(homePage.subscriptionSuccessMessage).toContainText(SUBSCRIPTION_SUCCESS_TEXT);
    });

});
