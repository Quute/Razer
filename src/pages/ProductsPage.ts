import { Locator, Page } from "@playwright/test";

export class ProductsPage {
    readonly page: Page;
    readonly productsMenuLink: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeader: Locator;
    readonly firstProductViewLink: Locator;

    // Product Detail Page Elements
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;

    // Cart Interaction Elements
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly viewCartModalLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // --- Navigation and Search Locators ---
        // We find the 'Products' link in the top menu by its href attribute (avoiding unicode spaces).
        this.productsMenuLink = page.locator('a[href="/products"]');

        // 'id' selector is used for the search box.
        this.searchInput = page.locator('input#search_product');

        // 'id' selector is used for the search button.
        this.searchButton = page.locator('button#submit_search');

        // The title that appears after a search operation. The h2 tag with the text-center class was detected.
        this.searchedProductsHeader = page.locator('h2.title.text-center').filter({ hasText: 'Searched Products' });

        // To capture the 'View Product' link of the first product in the product list (more stable css usage)
        this.firstProductViewLink = page.locator('.choose a').first();

        // --- Product Detail Page Locators ---
        // The product name on the product detail page is found as h2.
        this.productName = page.locator('.product-information h2');

        // Found as a paragraph (p) containing the text 'Category' within the product category.
        this.productCategory = page.locator("xpath=//p[contains(text(), 'Category')]");

        // Hierarchical span usage instead of class structure to find the product price.
        this.productPrice = page.locator('span > span').first();

        // 'contains' method to find Availability status.
        this.productAvailability = page.locator("xpath=//p[contains(., 'Availability:')]");

        // --- Cart Interaction Elements ---
        // Quantity input field id is quantity
        this.quantityInput = page.locator('#quantity');
        // 'Add to cart' button class is cart
        this.addToCartButton = page.locator('button.cart');
        // The 'View Cart' link inside the pop-up modal that appears after adding to the cart
        this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');
    }

    // 1. Navigate to products page from menu method
    async navigateToProducts() {
        await this.productsMenuLink.click();
    }

    // 2. Method that combines product search operation in a single function
    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    // 3. Navigate to the details of the first appeared product method
    async viewFirstProduct() {
        // Thanks to global route blocking (ad blocking) in baseTest, ads no longer cause DOM shifts.
        // Therefore, we can safely use the most stable default click method.
        await this.firstProductViewLink.click();
    }

    // 4. Set product quantity on detail page
    async setQuantity(quantity: string) {
        // Clear the input field content and enter new quantity
        await this.quantityInput.fill(quantity);
    }

    // 5. Click the 'Add to Cart' button
    async addToCart() {
        await this.addToCartButton.click();
    }

    // 6. Navigate to 'View Cart' from added to cart confirmation pop-up
    async viewCartFromModal() {
        await this.viewCartModalLink.click();
    }
}
