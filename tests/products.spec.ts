import { test, expect } from '../src/fixtures/baseTest';

test.describe('Ürün Arama ve Detay Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('/');
    });

    test('TC8: All products page lists items and detail page shows full info', async ({ productsPage, page }) => {
        // 4. Click 'Products' button
        await productsPage.navigateToProducts();

        // Google Vignette bypass — same site quirk seen in TC9/TC12/TC20.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        // 5. Verify user lands on ALL PRODUCTS page
        await expect(page).toHaveURL(/.*products/);
        await expect(productsPage.allProductsHeader).toBeVisible();

        // 6. Products list is visible (at least a few cards rendered)
        await expect(productsPage.productCards.first()).toBeVisible();
        expect(await productsPage.productCards.count()).toBeGreaterThan(0);

        // 7. Click 'View Product' of the first product
        await productsPage.viewFirstProduct();

        // 8. User is landed on product detail page
        await expect(page).toHaveURL(/.*product_details.*/);

        // 9. Verify all required detail fields are visible and non-empty
        await expect(productsPage.productName).toBeVisible();
        await expect(productsPage.productCategory).toBeVisible();
        await expect(productsPage.productPrice).toBeVisible();
        await expect(productsPage.productAvailability).toBeVisible();
        await expect(productsPage.productCondition).toBeVisible();
        await expect(productsPage.productBrand).toBeVisible();

        expect((await productsPage.productName.innerText()).trim()).not.toBe('');
        expect((await productsPage.productPrice.innerText()).trim()).not.toBe('');
        expect((await productsPage.productCategory.innerText()).trim()).toContain('Category');
        expect((await productsPage.productAvailability.innerText()).trim()).toContain('Availability');
        expect((await productsPage.productCondition.innerText()).trim()).toContain('Condition');
        expect((await productsPage.productBrand.innerText()).trim()).toContain('Brand');
    });

    test('Ürün detaylarında doğru bilgiler gösterilmeli ve ürün sepete eklenebilmeli', async ({ productsPage, cartPage, page }) => {
        // 1. Navigate to the products page
        await productsPage.navigateToProducts();

        // Google Vignette bypass — intermittent ad swallows the next click,
        // leaving us off the list page.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        // 2. Go to the details of the first product
        await productsPage.viewFirstProduct();

        // Vignette can also fire here; force navigation to the first product
        // detail if we're still on /products.
        if (!page.url().includes('product_details')) {
            await page.goto('/product_details/1');
        }

        // Verify with async wait that URL goes to product details (contains product_details)
        await expect(page).toHaveURL(/.*product_details.*/);

        // 3. Check if critical info (Name, Category, Price, etc.) is loaded in product details
        await expect(productsPage.productName).toBeVisible();
        await expect(productsPage.productCategory).toBeVisible();
        await expect(productsPage.productPrice).toBeVisible();
        await expect(productsPage.productAvailability).toBeVisible();

        // Optionally check if content has data (ensure it is not empty)
        expect(await productsPage.productName.innerText()).not.toBe('');
        expect(await productsPage.productPrice.innerText()).not.toBe('');

        // Save product name and price to verify on cart page
        const expectedProductName = await productsPage.productName.innerText();
        const expectedProductPrice = await productsPage.productPrice.innerText();

        // 4. Set quantity (e.g., 2 pieces)
        await productsPage.setQuantity('2');

        // 5. Add to cart. The site occasionally swallows the first click
        //    (add-to-cart stays idle without a server call). Retry once if
        //    the confirmation modal never renders — more deterministic than
        //    relying on viewCartFromModal's goto fallback which masks a
        //    failed add as an empty cart.
        await productsPage.addToCart();
        try {
            await productsPage.cartModal.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            await productsPage.addToCart();
            await productsPage.cartModal.waitFor({ state: 'visible', timeout: 8000 });
        }

        // 6. Go to cart via modal
        await productsPage.viewCartFromModal();

        // 7. Verify URL navigates to cart page
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 8. CartPage checks
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Verify added product details are correct
        const cartProductNameLocator = cartPage.getProductNameLocator(0);
        await expect(cartProductNameLocator).toHaveText(expectedProductName);

        const cartProductPriceLocator = cartPage.getProductPriceLocator(0);
        await expect(cartProductPriceLocator).toHaveText(expectedProductPrice);

        const cartProductQuantityLocator = cartPage.getProductQuantityLocator(0);
        await expect(cartProductQuantityLocator).toHaveText('2');
    });

});
