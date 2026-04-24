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
}
