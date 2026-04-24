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
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    // All Products Page Elements
    readonly allProductsHeader: Locator;

    // Cart Interaction Elements
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly viewCartModalLink: Locator;
    readonly continueShoppingButton: Locator;
    readonly cartModal: Locator;

    // Product List Elements (used for TC12 multi-add)
    readonly productCards: Locator;

    constructor(page: Page) {
        this.page = page;

        // --- Navigation and Search Locators ---
        // We find the 'Products' link in the top menu by its href attribute (avoiding unicode spaces).
        this.productsMenuLink = page.locator('a[href="/products"]');

        // 'id' selector is used for the search box.
        this.searchInput = page.locator('input#search_product');

        // 'id' selector is used for the search button.
        this.searchButton = page.locator('button#submit_search');

        // The title that appears after a search operation. Rendered text is uppercase ("SEARCHED PRODUCTS"), so use case-insensitive regex.
        this.searchedProductsHeader = page.locator('h2.title.text-center').filter({ hasText: /searched products/i });

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

        // Condition and Brand live in the same .product-information block as
        // adjacent <p> elements; text-based xpath is stable across layout tweaks.
        this.productCondition = page.locator("xpath=//p[contains(., 'Condition:')]");
        this.productBrand = page.locator("xpath=//p[contains(., 'Brand:')]");

        // 'ALL PRODUCTS' header on /products. DOM text is lower/mixed case but
        // rendered uppercase via CSS, so use a case-insensitive regex.
        this.allProductsHeader = page.locator('h2.title.text-center').filter({ hasText: /all products/i });

        // --- Cart Interaction Elements ---
        // Quantity input field id is quantity
        this.quantityInput = page.locator('#quantity');
        // 'Add to cart' button class is cart
        this.addToCartButton = page.locator('button.cart');
        // The 'View Cart' link inside the pop-up modal that appears after adding to the cart
        this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');

        // 'Continue Shopping' button inside the cart modal
        this.continueShoppingButton = page.locator('#cartModal button.close-modal');

        // Cart modal container (used to wait for hidden state after closing)
        this.cartModal = page.locator('#cartModal');

        // Product cards on the /products list page
        this.productCards = page.locator('.features_items .product-image-wrapper');
    }

    // 1. Navigate to products page from menu method
    async navigateToProducts() {
        await this.productsMenuLink.click();
    }

    // 2. Method that combines product search operation in a single function
    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        // Wait for navigation/reload triggered by form submit
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            this.searchButton.click(),
        ]);
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

    // 5. Click the 'Add to Cart' button on the product detail page. The site
    //    occasionally swallows the first click when the Google vignette
    //    interstitial fires — the click dismisses the ad instead of hitting
    //    the button, appending `#google_vignette` to the URL. We detect this
    //    and strip the hash, then retry. We also retry once more if the
    //    confirmation modal never renders. No modal = no server-side write,
    //    so retries are idempotent.
    async addToCart() {
        await this.addToCartButton.click();
        if (this.page.url().includes('#google_vignette')) {
            await this.page.goto(this.page.url().replace('#google_vignette', ''));
            await this.addToCartButton.click();
        }
        try {
            await this.cartModal.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            await this.addToCartButton.click();
            await this.cartModal.waitFor({ state: 'visible', timeout: 8000 });
        }
    }

    // 6. Navigate to 'View Cart' from added to cart confirmation pop-up.
    //    The site intermittently fails to render the cart modal after add-to-cart
    //    (no DOM insertion, likely JS/ad conflict), so fall back to direct
    //    navigation. If cart-add also failed server-side, the empty cart will
    //    surface a clearer assertion error than a hidden-locator timeout.
    async viewCartFromModal() {
        try {
            await this.viewCartModalLink.waitFor({ state: 'visible', timeout: 8000 });
            await this.viewCartModalLink.click();
        } catch {
            await this.page.goto('/view_cart');
        }
    }

    // 7. Add a product to cart from the product list page by index (0-based).
    //    Each product card has two add-to-cart links (base + hover overlay); hovering
    //    surfaces the overlay one which is the intended click target per TC12.
    //    Handles the Google vignette eating the click (strip `#google_vignette`
    //    and retry) and a generic missed click (retry once if the confirmation
    //    modal never renders). No modal = no server write = safe to retry.
    async addProductToCartByIndex(index: number) {
        const card = this.productCards.nth(index);
        const overlay = card.locator('.product-overlay .add-to-cart').first();

        const attemptClick = async () => {
            await card.scrollIntoViewIfNeeded();
            await card.hover();
            await overlay.click();
        };

        await attemptClick();
        if (this.page.url().includes('#google_vignette')) {
            await this.page.goto(this.page.url().replace('#google_vignette', ''));
            await attemptClick();
        }

        try {
            await this.cartModal.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
            await attemptClick();
            await this.cartModal.waitFor({ state: 'visible', timeout: 8000 });
        }
    }

    // 8. Dismiss the cart confirmation modal via 'Continue Shopping' and wait for it to hide.
    async continueShopping() {
        await this.continueShoppingButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.continueShoppingButton.click();
        await this.cartModal.waitFor({ state: 'hidden', timeout: 15000 });
    }
}
