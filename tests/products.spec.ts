import { test, expect } from '../src/fixtures/baseTest';

test.describe('Ürün Arama ve Detay Testleri', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('https://automationexercise.com/');
    });



    test('Ürün detaylarında doğru bilgiler gösterilmeli ve ürün sepete eklenebilmeli', async ({ productsPage, cartPage, page }) => {
        // 1. Navigate to the products page
        await productsPage.navigateToProducts();

        // 2. Go to the details of the first product
        await productsPage.viewFirstProduct();

        // Verify with async wait that URL goes to product details (contains product_details)
        await expect(page).toHaveURL(/.*product_details.*/);

        // 3. Check if critical info (Name, Category, Price, etc.) is loaded in product details
        await expect(productsPage.productName).toBeVisible();
        await expect(productsPage.productCategory).toBeVisible();
        await expect(productsPage.productPrice).toBeVisible();
        await expect(productsPage.productAvailability).toBeVisible();

        // Optionally check if content has data (ensure it is not empty)
        expect(await productsPage.productName.innerText()).not.toBe('');
        expect(await productsPage.productPrice.innerText()).not.toBe('');

        // Save product name and price to verify on cart page
        const expectedProductName = await productsPage.productName.innerText();
        const expectedProductPrice = await productsPage.productPrice.innerText();

        // 4. Set quantity (e.g., 2 pieces)
        await productsPage.setQuantity('2');

        // 5. Add to cart
        await productsPage.addToCart();

        // 6. Go to cart via modal
        await productsPage.viewCartFromModal();

        // 7. Verify URL navigates to cart page
        await expect(page).toHaveURL(/.*view_cart.*/);

        // 8. CartPage checks
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Verify added product details are correct
        const cartProductNameLocator = cartPage.getProductNameLocator(0);
        await expect(cartProductNameLocator).toHaveText(expectedProductName);

        const cartProductPriceLocator = cartPage.getProductPriceLocator(0);
        await expect(cartProductPriceLocator).toHaveText(expectedProductPrice);

        const cartProductQuantityLocator = cartPage.getProductQuantityLocator(0);
        await expect(cartProductQuantityLocator).toHaveText('2');
    });

});
