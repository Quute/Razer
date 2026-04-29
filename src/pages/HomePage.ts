import { Locator, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;

    // Header / nav
    readonly signupLoginLink: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly loggedInAsUser: Locator;
    readonly cartLink: Locator;
    readonly contactUsLink: Locator;

    // Category Navbar Locators
    readonly categoryWomen: Locator;
    readonly categoryWomenDress: Locator;
    readonly categoryMen: Locator;
    readonly categoryMenTshirts: Locator;
    readonly categoryTitle: Locator;
    readonly productNames: Locator;

    // Misc nav / page anchors (TC7, TC25/26)
    readonly testCasesLink: Locator;
    readonly scrollUpButton: Locator;
    readonly sliderCarousel: Locator;
    readonly sliderHeading: Locator;

    // Footer subscription block (TC10, TC11)
    readonly subscriptionHeader: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscriptionSuccessMessage: Locator;

    // Recommended items (TC22)
    readonly recommendedItemsHeader: Locator;
    readonly recommendedItemsSection: Locator;
    readonly recommendedAddToCartButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header / nav
        this.signupLoginLink = page.locator('a[href="/login"]').first();
        this.logoutLink = page.locator('a[href="/logout"]');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
        this.loggedInAsUser = page.locator('a:has-text("Logged in as") b');
        this.cartLink = page.locator('a[href="/view_cart"]').first();
        this.contactUsLink = page.locator('a[href="/contact_us"]');

        // The 'Women' category toggle link
        this.categoryWomen = page.locator('a[href="#Women"]');
        // The 'Dress' subcategory link under 'Women'
        this.categoryWomenDress = page.locator('a[href="/category_products/1"]');
        // The 'Men' category toggle link
        this.categoryMen = page.locator('a[href="#Men"]');
        // The 'Tshirts' subcategory link under 'Men'
        this.categoryMenTshirts = page.locator('a[href="/category_products/3"]');

        // The header title of the displayed category products
        this.categoryTitle = page.locator('h2.title.text-center');
        // The names of the products displayed on the page
        this.productNames = page.locator('.productinfo p');

        // 'Test Cases' link in the top nav (TC7).
        this.testCasesLink = page.locator('a[href="/test_cases"]').first();

        // Scroll-up arrow button anchored to #top, available on /; only
        // visible after the user scrolls past a threshold (TC25).
        this.scrollUpButton = page.locator('#scrollUp');
        // Top slider region used to confirm we're back at the page top.
        this.sliderCarousel = page.locator('#slider-carousel');
        // First slide heading inside the carousel — used as a visible
        // landmark for "is the user at the top?" assertions.
        this.sliderHeading = page.locator('#slider-carousel h1').first();

        // Footer subscription block (TC10, TC11). Note: site markup uses
        // the misspelled id 'susbscribe_email' for the input.
        this.subscriptionHeader = page.locator('h2', { hasText: /^Subscription$/i });
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscriptionSuccessMessage = page.locator('#success-subscribe');

        // Recommended items carousel on the home page (TC22).
        this.recommendedItemsSection = page.locator('.recommended_items');
        this.recommendedItemsHeader = this.recommendedItemsSection.locator('h2.title.text-center');
        // The active slide's add-to-cart buttons — only the visible slide's
        // controls are clickable, so scope to .item.active.
        this.recommendedAddToCartButtons = this.recommendedItemsSection.locator('.item.active .productinfo a.add-to-cart');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async openWomenDressCategory() {
        await this.categoryWomen.click();
        await this.categoryWomenDress.click();
    }

    async openMenTshirtsCategory() {
        await this.categoryMen.click();
        await this.categoryMenTshirts.click();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async getDisplayedCategoryTitle(): Promise<string> {
        return (await this.categoryTitle.innerText()).trim();
    }

    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor({ state: 'visible' });
        return await this.productNames.allInnerTexts();
    }

    // Subscribe via the footer form (used on home, cart and other pages).
    async subscribe(email: string) {
        await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    // Scroll the page all the way down so the footer subscription block /
    // scroll-up arrow become visible. Uses window.scrollTo at body height.
    async scrollToFooter() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    // Programmatic scroll back to the top — used by TC26 (no arrow click).
    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }
}
