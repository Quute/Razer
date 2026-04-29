import { test, expect } from '../src/fixtures/baseTest';

test.describe('Scroll-Up Tests (TC25, TC26)', () => {

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigate();
        // Slider must be visible before we measure scroll behavior.
        await expect(homePage.sliderHeading).toBeInViewport();
    });

    test('TC25: Scroll up using the arrow button', async ({ homePage }) => {
        // 1. Scroll to the bottom of the page so footer becomes visible
        await homePage.scrollToFooter();

        // 2. Verify subscription footer block is visible
        await expect(homePage.subscriptionHeader).toBeVisible();

        // 3. Click the scroll-up arrow
        await homePage.scrollUpButton.click();

        // 4. Verify the slider heading is back in viewport (i.e. scrolled to top)
        await expect(homePage.sliderHeading).toBeInViewport();
    });

    test('TC26: Scroll up to top without arrow button', async ({ homePage }) => {
        // 1. Scroll to footer
        await homePage.scrollToFooter();

        // 2. Footer is visible
        await expect(homePage.subscriptionHeader).toBeVisible();

        // 3. Scroll back up programmatically (no arrow click)
        await homePage.scrollToTop();

        // 4. Slider heading should be in viewport again
        await expect(homePage.sliderHeading).toBeInViewport();
    });

});
