import { test, expect } from '../src/fixtures/baseTest';

test.describe('Search Product Tests (TC9)', () => {

    test('Searching a product should show relevant results', async ({ productsPage, page }) => {
        // 1. Start from homepage, then go to products page
        await page.goto('/');
        await productsPage.navigateToProducts();
        
        // Google Ad (Vignette) handling: if ad intercepts the navigation, bypass it
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }
        
        await expect(page).toHaveURL(/.*products/);

        // 2. Enter search term and submit
        const searchTerm = 'dress';
        await productsPage.searchProduct(searchTerm);

        // Google Ad handling: The ad script often swallows the first click on the page.
        // If the click was intercepted and the form didn't submit, force the navigation.
        if (!page.url().includes('search=')) {
            await page.goto(`/products?search=${searchTerm}`);
        }

        // 3. Verify "Searched Products" header is visible
        await expect(productsPage.searchedProductsHeader).toBeVisible({ timeout: 15000 });

        // 4. Verify at least one product is returned and results relate to the search term
        const productCards = page.locator('.features_items .product-image-wrapper');
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);

        // At least one product name should contain the search term (case-insensitive)
        const names = await page.locator('.features_items .productinfo p').allInnerTexts();
        const relevant = names.some(n => n.toLowerCase().includes(searchTerm));
        expect(relevant, `Arama sonuçlarında "${searchTerm}" geçen ürün yok: ${names.join(', ')}`).toBeTruthy();
    });

});
