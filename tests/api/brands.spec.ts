import { test, expect } from '@playwright/test';

test.describe('Brands API Testing', () => {

    test('API 3: Get All Brands List', async ({ request }) => {
        const response = await request.get('/api/brandsList');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        
        if (body.responseCode) {
            expect(body.responseCode).toBe(200);
            expect(body.brands).toBeDefined();
            expect(body.brands.length).toBeGreaterThan(0);
        }
    });

    test('API 4: PUT To All Brands List', async ({ request }) => {
        const response = await request.put('/api/brandsList');
        
        const body = await response.json();
        
        if (body.responseCode === 405) {
            expect(body.responseCode).toBe(405);
            expect(body.message).toContain('This request method is not supported.');
        } else {
            expect(response.status()).toBe(405);
        }
    });

});
