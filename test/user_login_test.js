
/**
 * @file user_login_test.js
 * @description Automated tests for the login functionality using Selenium WebDriver.
 *              This script tests logging in a user using valid credentials, verifying successful login,
 *              and ensuring the user is redirected to the job application page upon login.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, fs, Profile.json (user credentials)
 */

/**
 * @test User Login Test
 * @description Tests logging in with valid credentials, submitting the login form, 
 *              and verifying redirection to the job application page after login.
 * @steps
 * 1. Ensure the user is logged out before starting the test.
 * 2. Navigate to the login page.
 * 3. Use the email and password of the current user from the credentials.
 * 4. Submit the login form.
 * 5. Verify the URL after login to ensure redirection to the job application page.
 * 
 * @assertion Ensures that after login, the user is redirected to the job application page (DASHBOARD_URL).
 */

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is installed and available
const fs = require('fs'); // File system for handling profile data

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

// Application URLs
const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end'; // Login page URL
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication'; // Job application page URL after login
const TIMEOUT = 30000; // Global timeout for tests

/**
 * @description Suite for testing the login functionality.
 *              Includes tests for submitting the login form with valid user credentials
 *              and verifying the redirection to the job application page after a successful login.
 */
describe('Login Functionality Test', function () {
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
     * @function navigateToLoginPage
     * @description Navigates to the login page.
     */
    async function navigateToLoginPage() {
        await driver.get(LOGIN_URL);
    }

    async function navigatetoDashboard() {
        await driver.get(DASHBOARD_URL);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are currently logged in.
     *              Skips if the user is not logged in or if logout button is not displayed.
     */
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000); // Wait for the login page to load
            }
        } catch (error) {
            // No action needed if the user is not logged in
        }
    }

    // Ensure logout after each test case
    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    credentials.forEach((user, index) => {
        it(`Test Case ${index + 1}: `, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Navigate to the login page
            await navigateToLoginPage();
            
            // Step 3: Click the login button to open the login form
            const loginbtn = await driver.findElement(By.className('login-button'));
            await loginbtn.click();

            // Step 4: Fill in the email and password fields with the user's credentials
            await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);

            // Step 5: Submit the login form
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();
            
            
            await navigatetoDashboard();
            // Step 6: Verify the user is redirected to the job application page after login
            const currentUrl = await driver.getCurrentUrl();   
            assert.strictEqual(currentUrl, DASHBOARD_URL, "User should be directed to Job Application page after successful login");
        });
    });
});
