import { test, expect } from '../src/fixtures/baseTest';

test.describe('Add Multiple Products in Cart (TC12)', () => {

    test('Cart should contain both products with correct price, quantity and total', async ({ page, productsPage, cartPage }) => {
        // 1. Start from homepage
        await page.goto('/');

        // 2. Go to products list
        await productsPage.navigateToProducts();

        // Google Vignette bypass (same pattern as TC9)
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }
        await expect(page).toHaveURL(/.*products/);

        // 3. Capture name + price of the first two products from the list
        const firstCard = productsPage.productCards.nth(0);
        const secondCard = productsPage.productCards.nth(1);

        const firstName = (await firstCard.locator('.productinfo p').innerText()).trim();
        const firstPrice = (await firstCard.locator('.productinfo h2').innerText()).trim();
        const secondName = (await secondCard.locator('.productinfo p').innerText()).trim();
        const secondPrice = (await secondCard.locator('.productinfo h2').innerText()).trim();

        // 4. Add first product → Continue Shopping
        await productsPage.addProductToCartByIndex(0);
        await productsPage.continueShopping();

        // 5. Add second product → View Cart
        await productsPage.addProductToCartByIndex(1);
        await productsPage.viewCartFromModal();

        await expect(page).toHaveURL(/.*view_cart/);

        // 6. Verify two rows in cart
        expect(await cartPage.getCartItemCount()).toBe(2);

        // 7. Verify names, prices, quantity (1), and totals for each product.
        //    Cart rows preserve insertion order, so row 0 = first product, row 1 = second.
        await expect(cartPage.getProductNameLocator(0)).toHaveText(firstName);
        await expect(cartPage.getProductPriceLocator(0)).toHaveText(firstPrice);
        await expect(cartPage.getProductQuantityLocator(0)).toHaveText('1');
        await expect(cartPage.getProductTotalLocator(0)).toHaveText(firstPrice);

        await expect(cartPage.getProductNameLocator(1)).toHaveText(secondName);
        await expect(cartPage.getProductPriceLocator(1)).toHaveText(secondPrice);
        await expect(cartPage.getProductQuantityLocator(1)).toHaveText('1');
        await expect(cartPage.getProductTotalLocator(1)).toHaveText(secondPrice);
    });

});
