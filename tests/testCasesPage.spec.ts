import { test, expect } from '../src/fixtures/baseTest';

test.describe('Test Cases Page Tests (TC7)', () => {

    test('TC7: Navigate to Test Cases page from header', async ({ homePage, page }) => {
        // 1. Launch browser and navigate to home
        await homePage.navigate();

        // 2. Verify home page is visible (slider is the most stable landmark)
        await expect(homePage.sliderCarousel).toBeVisible();

        // 3. Click on 'Test Cases' button in the top nav
        await homePage.testCasesLink.click();

        // Vignette bypass — pattern reused from TC8/TC9/TC19.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/test_cases');
        }

        // 4. Verify URL navigates to /test_cases
        await expect(page).toHaveURL(/.*test_cases/);

        // 5. Verify the page header is visible
        await expect(page.locator('h2.title.text-center', { hasText: /test cases/i })).toBeVisible();
    });

});
