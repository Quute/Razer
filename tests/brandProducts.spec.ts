import { test, expect } from '../src/fixtures/baseTest';

test.describe('Brand Products Tests (TC19)', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('/');
    });

    test('TC19: View & cart brand products via sidebar', async ({ productsPage, page }) => {
        // 2. Click on 'Products' button
        await productsPage.navigateToProducts();

        // Google Vignette bypass — same site quirk handled in TC8/TC9/TC12.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        // Verify we are on the All Products page
        await expect(page).toHaveURL(/.*products/);
        await expect(productsPage.allProductsHeader).toBeVisible();

        // 3. Verify that 'Brands' sidebar is visible on left side
        await expect(productsPage.brandsSidebar).toBeVisible();
        expect(await productsPage.brandsList.count()).toBeGreaterThan(0);

        // 4. Click on any brand name (Polo)
        const firstBrand = 'Polo';
        await productsPage.clickBrand(firstBrand);

        // 5. Verify user is navigated to brand page and brand products are displayed
        await expect(page).toHaveURL(new RegExp(`/brand_products/${firstBrand}`, 'i'));
        await expect(productsPage.getBrandHeader(firstBrand)).toBeVisible();
        await expect(productsPage.productCards.first()).toBeVisible();
        expect(await productsPage.productCards.count()).toBeGreaterThan(0);

        // 6. On left sidebar, click on another brand (Madame)
        const secondBrand = 'Madame';
        await productsPage.clickBrand(secondBrand);

        // 7. Verify user is navigated to that brand page and can see products
        await expect(page).toHaveURL(new RegExp(`/brand_products/${secondBrand}`, 'i'));
        await expect(productsPage.getBrandHeader(secondBrand)).toBeVisible();
        await expect(productsPage.productCards.first()).toBeVisible();
        expect(await productsPage.productCards.count()).toBeGreaterThan(0);
    });

});
