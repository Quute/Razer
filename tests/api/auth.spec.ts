import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Auth API Testing', () => {
    // We use a dynamic email to avoid conflicts across test runs
    const timestamp = Date.now();
    const testEmail = `apitest${timestamp}@example.com`;
    const testPassword = 'Password123';

    test('API 11: POST To Create/Register User Account', async ({ request }) => {
        const response = await request.post('/api/createAccount', {
            form: {
                name: 'API Test User',
                email: testEmail,
                password: testPassword,
                title: 'Mr',
                birth_date: '10',
                birth_month: 'May',
                birth_year: '1990',
                firstname: 'API',
                lastname: 'User',
                company: 'Automation',
                address1: '123 API Street',
                address2: 'Apt 4',
                country: 'United States',
                zipcode: '12345',
                state: 'California',
                city: 'Los Angeles',
                mobile_number: '1234567890'
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(201);
        expect(body.message).toBe('User created!');
    });

    test('API 7: POST To Verify Login with valid details', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: {
                email: testEmail,
                password: testPassword
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });

    test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: {
                password: testPassword
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
        expect(body.message).toContain('email or password parameter is missing');
    });

    test('API 9: DELETE To Verify Login', async ({ request }) => {
        const response = await request.delete('/api/verifyLogin');
        const body = await response.json();
        if (body.responseCode === 405) {
            expect(body.responseCode).toBe(405);
            expect(body.message).toContain('This request method is not supported.');
        } else {
            expect(response.status()).toBe(405);
        }
    });

    test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: {
                email: 'wrongemail' + timestamp + '@example.com',
                password: 'wrongpassword'
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(404);
        expect(body.message).toBe('User not found!');
    });

    test('API 13: PUT METHOD To Update User Account', async ({ request }) => {
        const response = await request.put('/api/updateAccount', {
            form: {
                name: 'API Test User Updated',
                email: testEmail,
                password: testPassword,
                title: 'Mr',
                birth_date: '10',
                birth_month: 'May',
                birth_year: '1990',
                firstname: 'API',
                lastname: 'User',
                company: 'Automation Updated',
                address1: '123 API Street',
                address2: 'Apt 4',
                country: 'United States',
                zipcode: '12345',
                state: 'California',
                city: 'Los Angeles',
                mobile_number: '1234567890'
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User updated!');
    });

    test('API 14: GET user account detail by email', async ({ request }) => {
        // According to documentation, parameters for GET are typically sent as query strings.
        const response = await request.get('/api/getUserDetailByEmail', {
            params: { email: testEmail }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.user).toBeDefined();
        // Since API might return string or object depending on their implementation, just verify email
        expect(body.user.email).toBe(testEmail);
    });

    test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
        const response = await request.delete('/api/deleteAccount', {
            form: {
                email: testEmail,
                password: testPassword
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('Account deleted!');
    });

});
