import { test, expect } from '../src/fixtures/baseTest';

const TEST_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe('Download Invoice Tests (TC24)', () => {

    test.beforeEach(async ({ loginPage }) => {
        // Reuse the registered test account so we can complete checkout fast.
        await loginPage.navigate();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    });

    test('TC24: Place an order and download the invoice', async ({
        productsPage, cartPage, checkoutPage, paymentPage, paymentSuccessPage, page
    }) => {
        // 1. Add a product and proceed through the standard checkout flow
        await productsPage.navigateToProducts();

        // Vignette can swallow the next click; recover both on /products and
        // on the View-Product transition before we touch addToCart.
        if (page.url().includes('#google_vignette')) {
            await page.goto('/products');
        }

        await productsPage.viewFirstProduct();
        if (!page.url().includes('product_details')) {
            await page.goto('/product_details/1');
        }

        await productsPage.addToCart();
        await productsPage.viewCartFromModal();

        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout.*/);

        await checkoutPage.placeOrder();
        await expect(page).toHaveURL(/.*payment.*/);

        await paymentPage.fillPaymentDetails('Tester', '4111111111111111', '311', '12', '2030');
        await paymentPage.submitPayment();

        // 2. Order placed — assert success header is visible
        await expect(page).toHaveURL(/.*payment_done.*/);
        await expect(paymentSuccessPage.successMessage).toBeVisible();

        // 3. Click 'Download Invoice' and capture the download via Playwright's
        //    waitForEvent('download'). Verify file name and that it has content.
        const download = await paymentSuccessPage.downloadInvoice();
        const suggestedName = download.suggestedFilename();
        expect(suggestedName.toLowerCase()).toContain('invoice');

        // Read the downloaded file's content to ensure it is non-empty.
        const stream = await download.createReadStream();
        const chunks: Buffer[] = [];
        for await (const chunk of stream) chunks.push(chunk as Buffer);
        const content = Buffer.concat(chunks).toString('utf8');
        expect(content.length).toBeGreaterThan(0);

        // 4. Click Continue to complete the flow
        await paymentSuccessPage.clickContinue();
    });

});
