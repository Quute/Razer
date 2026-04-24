import { test, expect } from '@playwright/test';

test.describe('Brands API Testing', () => {

    test('API 3: Get All Brands List', async ({ request }) => {
        const response = await request.get('/api/brandsList');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(Array.isArray(body.brands)).toBe(true);
        expect(body.brands.length).toBeGreaterThan(0);
    });

    test('API 4: PUT To All Brands List', async ({ request }) => {
        const response = await request.put('/api/brandsList');

        // Site returns HTTP 200 with responseCode 405 in the body for unsupported
        // methods. Safe-parse in case the server ever drops non-JSON on this path.
        const body = await response.json().catch(() => null);
        expect(body, 'Response body must be JSON').not.toBeNull();
        expect(body.responseCode).toBe(405);
        expect(body.message).toContain('This request method is not supported.');
    });

});
