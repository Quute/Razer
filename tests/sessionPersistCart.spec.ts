import { test, expect } from '../src/fixtures/baseTest';

const TEST_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('TC20 - Search Products and Verify Cart After Login', () => {

    test('Cart should retain guest-added products after logging in', async ({
        page,
        homePage,
        productsPage,
        cartPage,
        loginPage
    }) => {
        // Pre-cleanup: ensure the test account starts with an empty server-side
        // cart. Guest items merge with the account cart on login, so any leftover
        // from a prior run would pollute this test.
        await loginPage.navigate();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        await homePage.cartLink.click();
        const existingCount = await cartPage.getCartItemCount();
        for (let i = 0; i < existingCount; i++) {
            await cartPage.deleteProductFromCart(0);
            await expect(cartPage.cartRows).toHaveCount(existingCount - i - 1);
        }
        await homePage.logout();

        // 1-2. Launch & navigate (back to a clean guest session)
        await homePage.navigate();

        // 3. Click on 'Products' button
        await productsPage.navigateToProducts();

        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        // 4. Verify user is navigated to ALL PRODUCTS page
        await expect(page).toHaveURL(/.*products/);

        // 5. Enter product name and click search
        const searchTerm = 'top';
        await productsPage.searchProduct(searchTerm);

        if (!page.url().includes('search=')) {
            await page.goto(`/products?search=${searchTerm}`);
        }

        // 6. Verify 'SEARCHED PRODUCTS' is visible
        await expect(productsPage.searchedProductsHeader).toBeVisible({ timeout: 15000 });

        // 7. Verify at least two products are returned
        const resultCount = await productsPage.productCards.count();
        expect(resultCount).toBeGreaterThanOrEqual(2);

        // Capture names of the two products we'll add
        const firstName = (await productsPage.productCards.nth(0).locator('.productinfo p').innerText()).trim();
        const secondName = (await productsPage.productCards.nth(1).locator('.productinfo p').innerText()).trim();
        const expectedNames = [firstName, secondName].sort();

        // 8. Add those products to cart (first two search results)
        await productsPage.addProductToCartByIndex(0);
        await productsPage.continueShopping();

        await productsPage.addProductToCartByIndex(1);
        await productsPage.viewCartFromModal();

        // 9. Verify products are visible in cart (guest cart)
        await expect(page).toHaveURL(/.*view_cart/);
        expect(await cartPage.getCartItemCount()).toBe(2);
        const guestCartNames = (await cartPage.cartRows.locator('td.cart_description h4 a').allInnerTexts())
            .map(s => s.trim())
            .sort();
        expect(guestCartNames).toEqual(expectedNames);

        // 10. Click 'Signup / Login' and submit login details
        await homePage.signupLoginLink.click();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

        // Confirm we are logged in
        await expect(homePage.loggedInAsUser).toBeVisible();

        // 11. Go to Cart page again
        await homePage.cartLink.click();
        await expect(page).toHaveURL(/.*view_cart/);

        // 12. Verify the same products persist after login (set-based; server
        //     may reorder on merge with the logged-in cart).
        expect(await cartPage.getCartItemCount()).toBe(2);
        const loggedInCartNames = (await cartPage.cartRows.locator('td.cart_description h4 a').allInnerTexts())
            .map(s => s.trim())
            .sort();
        expect(loggedInCartNames).toEqual(expectedNames);

        // Cleanup: empty the cart so the account stays clean for other tests
        await cartPage.deleteProductFromCart(0);
        await expect(cartPage.cartRows).toHaveCount(1);
        await cartPage.deleteProductFromCart(0);
        await expect(cartPage.cartRows).toHaveCount(0);
    });
});
