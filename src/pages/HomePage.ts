import { Locator, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly categoryWomen: Locator;
    readonly categoryWomenDress: Locator;
    readonly categoryTitle: Locator;
    readonly productNames: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Category Navbar Locators
        // The 'Women' category toggle link
        this.categoryWomen = page.locator('a[href="#Women"]');
        
        // The 'Dress' subcategory link under 'Women'
        this.categoryWomenDress = page.locator('a[href="/category_products/1"]');
        
        // The header title of the displayed category products
        this.categoryTitle = page.locator('h2.title.text-center');
        
        // The names of the products displayed on the page
        this.productNames = page.locator('.productinfo p');
    }

    /**
     * Clicks on the 'Women' category to expand it, then clicks on 'Dress'.
     */
    async openWomenDressCategory() {
        await this.categoryWomen.click();
        await this.categoryWomenDress.click();
    }

    /**
     * Gets the title of the currently displayed category.
     * @returns The category title text.
     */
    async getDisplayedCategoryTitle(): Promise<string> {
        return (await this.categoryTitle.innerText()).trim();
    }

    /**
     * Gets the names of all currently displayed products.
     * @returns Array of product names.
     */
    async getProductNames(): Promise<string[]> {
        // Wait for at least one product to be visible to ensure elements are loaded
        await this.productNames.first().waitFor({ state: 'visible' });
        return await this.productNames.allInnerTexts();
    }
}
