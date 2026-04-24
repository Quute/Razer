import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentSuccessPage } from '../pages/PaymentSuccessPage';
import { SignupPage } from '../pages/SignupPage';
import { ContactUsPage } from '../pages/ContactUsPage';

// Create a fixture containing page objects
type MyFixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    homePage: HomePage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
    paymentSuccessPage: PaymentSuccessPage;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
}

// Extend Playwright's test function to add our custom fixture
export const test = base.extend<MyFixtures>({

    // Global Page Fixture overrides to block Ads
    page: async ({ page }, use) => {
        // Cancel ad and analytics network requests to speed up page load and prevent layout shifts
        await page.route('**/*', (route) => {
            const blockedDomains = [
                'googleads.g.doubleclick.net',
                'adservice.google.com',
                'pagead2.googlesyndication.com',
                'www.google-analytics.com',
                'cdn.carbonads.com',
                'srv.carbonads.net',
                'fundingchoicesmessages.google.com' // Consent form domain
            ];

            const url = route.request().url();
            if (blockedDomains.some(domain => url.includes(domain))) {
                route.abort(); // Block ad request
            } else {
                route.continue(); // Allow other requests
            }
        });

        // Inject script to hide/remove ad or consent modals at the DOM level
        await page.addInitScript(() => {
            // Clear ad containers when page loads and periodically
            setInterval(() => {
                const adsAndModals = document.querySelectorAll('.fc-dialog-container, iframe[id^="aswift"], iframe[name^="aswift"], .adsbygoogle');
                adsAndModals.forEach(el => el.remove());
            }, 500); // Check and remove every half second
        });

        await use(page);
    },

    // Define loginPage fixture
    loginPage: async ({ page }, use) => {
        // Create the page object and make it ready to use
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    // Define productsPage fixture
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
    // Define cartPage fixture
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    // Define homePage fixture
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    // Define checkoutPage fixture
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    // Define paymentPage fixture
    paymentPage: async ({ page }, use) => {
        const paymentPage = new PaymentPage(page);
        await use(paymentPage);
    },
    // Define paymentSuccessPage fixture
    paymentSuccessPage: async ({ page }, use) => {
        const paymentSuccessPage = new PaymentSuccessPage(page);
        await use(paymentSuccessPage);
    },
    // Define signupPage fixture
    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },
    // Define contactUsPage fixture
    contactUsPage: async ({ page }, use) => {
        const contactUsPage = new ContactUsPage(page);
        await use(contactUsPage);
    },
});

export { expect } from '@playwright/test';
