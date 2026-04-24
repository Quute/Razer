import { test, expect } from '@playwright/test';

test.describe('Products API Testing', () => {

    test('API 1: Get All Products List', async ({ request }) => {
        const response = await request.get('/api/productsList');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.products)).toBe(true);
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 2: POST To All Products List', async ({ request }) => {
        const response = await request.post('/api/productsList');

        // Site returns HTTP 200 with responseCode 405 in the body for unsupported
        // methods. Safe-parse in case the server ever drops non-JSON on this path.
        const body = await response.json().catch(() => null);
        expect(body, 'Response body must be JSON').not.toBeNull();
        expect(body.responseCode).toBe(405);
        expect(body.message).toContain('This request method is not supported.');
    });

    test('API 5: POST To Search Product with valid parameter', async ({ request }) => {
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: 'tshirt'
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.products)).toBe(true);
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
        const response = await request.post('/api/searchProduct');

        const body = await response.json().catch(() => null);
        expect(body, 'Response body must be JSON').not.toBeNull();
        expect(body.responseCode).toBe(400);
        expect(body.message).toContain('Bad request, search_product parameter is missing in POST request.');
    });

});
