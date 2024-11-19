
/**
 * @file user_registration_functionality_test.js
 * @description Automated tests for the user registration functionality using Selenium WebDriver.
 *              This script tests registering a user by filling in a registration form with valid user credentials,
 *              verifying successful registration, and ensuring the user is redirected to the profile page.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, fs, Profile.json (user credentials)
 */


/**
 * @test User Registration Test
 * @description Tests filling the registration form, submitting it, and verifying redirection to the profile page.
 * @steps
 * 1. Navigate to the registration page.
 * 2. Fill in the user's first name, last name, email, password, and confirm password fields.
 * 3. Submit the registration form.
 * 4. Verify the URL is redirected to the user profile page upon successful registration.
 * 
 * @assertion Ensures the current URL matches the expected dashboard URL after registration.
 */
// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is installed and available

// Application URLs
const REGISTRATION_URL = 'http://localhost:3000/hire-wire-front-end/registration';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const TIMEOUT = 30000; // Global timeout for tests
const credentials = require('./Profile.json'); // User credentials for testing

/**
 * @description Suite for testing user registration functionality.
 *              Includes tests for filling out the registration form, submitting it, 
 *              and verifying redirection to the profile page upon successful registration.
 */
describe('User Registration Functionality Test', function () {
    this.timeout(TIMEOUT); // Set timeout for all test cases in this suite

    let driver; // WebDriver instance

    /**
     * @description Initializes the WebDriver before tests.
     */
    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    /**
     * @description Quits the WebDriver after tests.
     */
    after(async () => {
        await driver.quit();
    });

    /**
     * @function navigateToRegistrationPage
     * @description Navigates to the registration page.
     */
    async function navigateToRegistrationPage() {
        await driver.get(REGISTRATION_URL);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are currently logged in.
     *              Skips if the user is not logged in or logout button is not present.
     */
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(REGISTRATION_URL), 5000); // Wait for registration page URL
            }
        } catch (error) {
            // No action needed if user is not logged in
        }
    }

    // Ensure logout after each test case
    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`Test Case ${index + 1}:`, async () => {
            // Step 1: Navigate to the registration page
            await navigateToRegistrationPage();
            console.log("Email:", user.emailAddress);
            console.log("First Name:", user.firstName);

            // Step 2: Fill in the registration form with user credentials
            await driver.findElement(By.css('input[placeholder="First Name"]')).sendKeys(user.firstName);
            await driver.findElement(By.css('input[placeholder="Last Name"]')).sendKeys(user.lastName);
            await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(user.password);
            await driver.findElement(By.css('input[placeholder="Re-enter Password"]')).sendKeys(user.confirmPassword);

            // Step 3: Submit the registration form
            const registerButton = await driver.findElement(By.css('button[type="submit"]'));
            await registerButton.click();

            await driver.sleep(1000);
            // Step 4: Verify the user is redirected to the user profile page
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, DASHBOARD_URL, "After successful registration, the user should be redirected to the user profile page.");
        });
    });
});
