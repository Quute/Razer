import { test, expect } from '../src/fixtures/baseTest';

test.describe('Add Review on Product Tests (TC21)', () => {

    test('TC21: Submit a review on a product detail page', async ({ productsPage, page }) => {
        // 1. Open home then go to products list
        await page.goto('/');
        await productsPage.navigateToProducts();

        // Vignette bypass — same recovery used elsewhere.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }
        await expect(page).toHaveURL(/.*products/);

        // 2. Click 'View Product' on the first card → land on product details
        await productsPage.viewFirstProduct();
        if (!page.url().includes('product_details')) {
            await page.goto('/product_details/1');
        }
        await expect(page).toHaveURL(/.*product_details.*/);

        // 3. Verify 'Write Your Review' tab is visible on the page
        await expect(productsPage.writeReviewTab).toBeVisible();

        // 4. Fill name, email and a review body
        await productsPage.submitReview(
            'Reviewer Test',
            `reviewer_${Date.now()}@test.com`,
            'This is an automated review submission for TC21.'
        );

        // 5. Verify success alert ("Thank you for your review.") is rendered
        await expect(productsPage.reviewSuccessMessage).toBeVisible({ timeout: 10000 });
        await expect(productsPage.reviewSuccessMessage).toContainText(/thank you for your review/i);
    });

});
