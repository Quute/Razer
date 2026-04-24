import { test, expect } from '@playwright/test';

test.describe('Products API Testing', () => {

    test('API 1: Get All Products List', async ({ request }) => {
        const response = await request.get('/api/productsList');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        // Check if body is an object or string that parses to object.
        // The API returns a stringified JSON sometimes, but Playwright's .json() parses it.
        // Let's assert it has products
        if (body.responseCode) {
            expect(body.responseCode).toBe(200);
            expect(body.products).toBeDefined();
        }
    });

    test('API 2: POST To All Products List', async ({ request }) => {
        const response = await request.post('/api/productsList');
        
        // According to docs, response code should be 405, but this API returns 200 with custom JSON sometimes
        // Let's check status. If the server returns 200 with an error in JSON, we'll catch it.
        // First we check what the server really returns.
        const body = await response.json();
        
        if (body.responseCode === 405) {
            expect(body.responseCode).toBe(405);
            expect(body.message).toContain('This request method is not supported.');
        } else {
            expect(response.status()).toBe(405);
        }
    });

    test('API 5: POST To Search Product with valid parameter', async ({ request }) => {
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: 'tshirt'
            }
        });
        
        expect(response.status()).toBe(200);
        const body = await response.json();
        
        if (body.responseCode) {
            expect(body.responseCode).toBe(200);
            expect(body.products).toBeDefined();
            // Expect at least one product is returned
            expect(body.products.length).toBeGreaterThan(0);
        }
    });

    test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
        const response = await request.post('/api/searchProduct');
        
        const body = await response.json();
        if (body.responseCode === 400) {
            expect(body.responseCode).toBe(400);
            expect(body.message).toContain('Bad request, search_product parameter is missing in POST request.');
        } else {
            expect(response.status()).toBe(400);
        }
    });

});
