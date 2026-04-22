import { test, expect } from '../src/fixtures/baseTest';

test.describe('Sepetten Ürün Silme Testleri', () => {

    test.beforeEach(async ({ page, productsPage }) => {
        // Navigate to the homepage before each test
        await page.goto('/');

        // Setup steps: add 2 products to the cart
        await productsPage.navigateToProducts();
        await productsPage.viewFirstProduct();

        // Wait for page load to skip ads or pop-ups
        await expect(page).toHaveURL(/.*product_details.*/);

        // Add 2 products
        await productsPage.setQuantity('2');
        await productsPage.addToCart();
        await productsPage.viewCartFromModal();

        // Verify we are on the cart page
        await expect(page).toHaveURL(/.*view_cart.*/);
    });



    test('Sepetteki ürünleri tamamen silerek sepeti boşaltma (2\'den 0\'a)', async ({ cartPage }) => {
        // Initially, there is 1 product item (a row containing 2 pieces)
        let itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // 1. Remove the product completely (click the X button)
        await cartPage.deleteProductFromCart(0);

        // 2. Wait for deletion to complete and cart to be empty
        // Verify the deleted row is no longer in the DOM
        await expect(cartPage.cartRows).toHaveCount(0);

        // 3. Verify the "Cart is empty!" message is visible
        await expect(cartPage.emptyCartMessage).toBeVisible();
        await expect(cartPage.emptyCartMessage).toContainText('Cart is empty!');
    });

});
