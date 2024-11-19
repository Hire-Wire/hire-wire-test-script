
/**
 * @file delete_experience_test.js
 * @description Automated tests for deleting user experience in a web application.
 *              The script tests the login process, navigation to the user profile page and delete the user profile.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

/**
 * @description This test case verifies that the user can delete an experience from their profile.
 *              It involves logging in with valid credentials, navigating to the experience page,
 *              and clicking the delete button to remove a job experience.
 * 
 * @steps
 * 1. Ensure the user is logged out if already logged in.
 * 2. Log in using valid credentials from the Profile.json file.
 * 3. Verify that the user is redirected to the dashboard after login.
 * 4. Navigate to the experience page.
 * 5. Attempt to delete a job experience by clicking the delete button.
 * 6. Verify that the experience is present to delete.
 * 
 * @assertion The test asserts that the delete button is present and can be clicked, 
 *            or an error is thrown if the delete button is not found.
 */

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');

const credentials = require('./Profile.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const PROFILE_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const EXPERIENCE_URL = 'http://localhost:3000/hire-wire-front-end/experience';
const TIMEOUT = 30000;

describe('Delete Experience from User Profile Functionality Test', function () {
    this.timeout(TIMEOUT); // Set timeout for the test suite

    let driver;

    /**
     * @description Initializes the WebDriver before starting the tests.
     * @throws Error if the WebDriver cannot be initialized.
     */
    before(async () => {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {
            console.error('Error initializing WebDriver:', error);
        }
    });

    /**
     * @description Quits the WebDriver after completing the tests.
     * @throws Error if the WebDriver cannot be quit.
     */
    after(async () => {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the WebDriver:', error);
        }
    });

    /**
     * @function navigateToLoginPage
     * @description Navigates to the login page.
     * @throws Error if the page cannot be loaded.
     */
    async function navigateToLoginPage() {
        await driver.get(LOGIN_URL);
    }

    /**
     * @function navigateToExperiencePage
     * @description Navigates to the user's experience page.
     * @throws Error if the page cannot be loaded.
     */
    async function navigateToExperiencePage() {
        await driver.get(EXPERIENCE_URL);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are logged in.
     * @throws Error if logout action cannot be performed.
     */
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElements(By.xpath('//button[@type="logout"]'));
            if (logoutButton.length > 0 && await logoutButton[0].isDisplayed()) {
                await logoutButton[0].click();
                await driver.wait(until.urlContains(LOGIN_URL), 500); // Wait for the login page to load
            }
        } catch (error) {
            // Ignore the error if logout button is not found
        }
    }

    // Ensure the user is logged out after each test
    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`Test case  ${index + 1}`, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();
            await navigateToLoginPage();

            // Step 2: Log in using valid credentials from the Profile.json file
            const loginButton = await driver.findElement(By.xpath('//button[contains(@class, "login-button")]'));
            await loginButton.click();

            await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();

            await driver.sleep(1000);
            // Step 3: Verify that the user is redirected to the dashboard after login
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, DASHBOARD_URL, `User cannot add their job experience because they cannot log in with these credentials.`);
    
            // Step 4: Navigate to the experience page
            await navigateToExperiencePage();
            

            try {
                // Step 5: Attempt to delete a job experience by clicking the delete button
                const deleteButton = await driver.findElement(By.xpath('//button[contains(@class, "remove-button") and @type="button"]'));
                assert.strict(deleteButton, 'There is no experience to delete');
                
                //  step 6. Verify that the experience is present to delete.
                await deleteButton.click();
            } catch (error) {
                // Handle case where delete button is not found
                assert.fail('There is no experience to delete');
            }
        });
    });
});