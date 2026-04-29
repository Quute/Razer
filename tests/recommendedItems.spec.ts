import { test, expect } from '../src/fixtures/baseTest';

test.describe('Recommended Items Tests (TC22)', () => {

    test('TC22: Add a recommended item to cart from home page', async ({ homePage, productsPage, cartPage, page }) => {
        // 1. Open home page
        await homePage.navigate();

        // 2. Scroll to the recommended items carousel near the bottom
        await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();

        // 3. Verify 'RECOMMENDED ITEMS' header is visible
        await expect(homePage.recommendedItemsHeader).toBeVisible();

        // 4. Click 'Add To Cart' on the first product of the active slide.
        //    Capture the product name first so we can assert it on the cart page.
        const firstAddBtn = homePage.recommendedAddToCartButtons.first();
        await firstAddBtn.scrollIntoViewIfNeeded();

        const expectedProductName = (
            await firstAddBtn.locator('xpath=ancestor::div[@class="productinfo text-center"]/p').innerText()
        ).trim();

        await firstAddBtn.click();

        // The site shows the same #cartModal confirmation as elsewhere.
        // Vignette can swallow the click; retry once if modal didn't render.
        if (page.url().includes('#google_vignette')) {
            await page.goto(page.url().replace('#google_vignette', ''));
            await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
            await firstAddBtn.click();
        }
        try {
            await productsPage.cartModal.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            await firstAddBtn.click();
            await productsPage.cartModal.waitFor({ state: 'visible', timeout: 8000 });
        }

        // 5. Click 'View Cart' from the modal and verify the product is listed
        await productsPage.viewCartFromModal();
        await expect(page).toHaveURL(/.*view_cart.*/);

        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);

        const cartProductName = (await cartPage.getProductNameLocator(0).innerText()).trim();
        expect(cartProductName.toLowerCase()).toBe(expectedProductName.toLowerCase());
    });

});
