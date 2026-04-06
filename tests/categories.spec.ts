import { test, expect } from '../src/fixtures/baseTest';

test.describe('Kategori Menüsü Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('https://automationexercise.com/');
    });

    test('Women -> Dress kategorisindeki ürünlerin doğru listelendiği doğrulanmalı', async ({ homePage, page }) => {
        // 1. Expand the Women category and click on Dress
        await homePage.openWomenDressCategory();

        // 2. Verify the title of the opened category page (content check only)
        const categoryTitle = await homePage.getDisplayedCategoryTitle();
        expect(categoryTitle.toLowerCase()).toContain('dress');

        // Verify that the URL contains /category_products/1
        await expect(page).toHaveURL(/.*category_products\/1.*/);

        // 3. Verify that products are listed and relevant to "Dress"
        const productNames = await homePage.getProductNames();

        // Ensure there is at least one product
        expect(productNames.length).toBeGreaterThan(0);

        // Check if "Dress" (case insensitive) is present in each product's name
        const allDresses = productNames.every(name => name.toLowerCase().includes('dress'));

        // It is expected that products under Women - Dress category are dresses.
        // If the API returns non-dress items, this test might fail,
        // but it covers our expected scenario of verifying product types.
        expect(allDresses, `Tüm ürün isimlerinde "Dress" kelimesi geçmiyor. Ürünler: \n${productNames.join('\n')}`).toBeTruthy();
    });

});
