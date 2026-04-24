import { test, expect, APIRequestContext } from '@playwright/test';

const basePayload = {
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
};

const uniqueEmail = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

const registerUser = (request: APIRequestContext, email: string, password: string) =>
    request.post('/api/createAccount', {
        form: { name: 'API Test User', email, password, ...basePayload }
    });

const deleteUser = (request: APIRequestContext, email: string, password: string) =>
    request.delete('/api/deleteAccount', { form: { email, password } });

test.describe('Auth API Testing', () => {
    // Primary account lives for the whole suite. Tests that need a logged-in
    // user read from here; tests that own their lifecycle (API 11, 12) create
    // their own throw-away accounts so they stay independent.
    const primaryEmail = uniqueEmail('apitest');
    const primaryPassword = 'Password123';

    test.beforeAll(async ({ request }) => {
        const res = await registerUser(request, primaryEmail, primaryPassword);
        const body = await res.json();
        expect(body.responseCode, 'Primary user must register').toBe(201);
    });

    test.afterAll(async ({ request }) => {
        // Best-effort cleanup — never fails the suite even if the user was
        // already deleted by a test or never created due to beforeAll failure.
        await deleteUser(request, primaryEmail, primaryPassword).catch(() => null);
    });

    test('API 7: POST To Verify Login with valid details', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: { email: primaryEmail, password: primaryPassword }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });

    test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: { password: primaryPassword }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
        expect(body.message).toContain('email or password parameter is missing');
    });

    test('API 9: DELETE To Verify Login', async ({ request }) => {
        const response = await request.delete('/api/verifyLogin');
        const body = await response.json().catch(() => null);
        expect(body, 'Response body must be JSON').not.toBeNull();
        expect(body.responseCode).toBe(405);
        expect(body.message).toContain('This request method is not supported.');
    });

    test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: { email: uniqueEmail('nonexistent'), password: 'wrongpassword' }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(404);
        expect(body.message).toBe('User not found!');
    });

    test('API 11: POST To Create/Register User Account', async ({ request }) => {
        // Owns its own throw-away account so the test is independent and
        // doesn't pollute the primary user.
        const email = uniqueEmail('register');
        const password = 'Password123';

        const response = await registerUser(request, email, password);
        const body = await response.json();
        expect(body.responseCode).toBe(201);
        expect(body.message).toBe('User created!');

        await deleteUser(request, email, password).catch(() => null);
    });

    test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
        // Create a dedicated user so the delete assertion operates on a known
        // fresh account, independent of the primary.
        const email = uniqueEmail('delete');
        const password = 'Password123';

        const registerRes = await registerUser(request, email, password);
        expect((await registerRes.json()).responseCode).toBe(201);

        const response = await deleteUser(request, email, password);
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('Account deleted!');
    });

    test('API 13: PUT METHOD To Update User Account', async ({ request }) => {
        const response = await request.put('/api/updateAccount', {
            form: {
                name: 'API Test User Updated',
                email: primaryEmail,
                password: primaryPassword,
                ...basePayload,
                company: 'Automation Updated'
            }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User updated!');
    });

    test('API 14: GET user account detail by email', async ({ request }) => {
        const response = await request.get('/api/getUserDetailByEmail', {
            params: { email: primaryEmail }
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.user).toBeDefined();
        expect(body.user.email).toBe(primaryEmail);
    });

});
