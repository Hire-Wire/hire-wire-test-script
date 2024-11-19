
/**
 * @file delete_user_profile_test.js
 * @description Automated tests for deleting user profile in a web application.
 *              The script tests the login process, navigation to the user profile page and delete the user profile.
 * 
 * @dependencies selenium-webdriver, chromedriver, assert, Profile.json (user credentials)
 */

/**
 * @description This test case verifies that the user can delete their profile.
 *              It involves logging in with valid credentials, navigating to the profile page,
 *              clicking the delete button, confirming the deletion, and verifying the result.
 * 
 * @steps
 * 1. Ensure the user is logged out if already logged in.
 * 2. Log in using valid credentials from the Profile.json file.
 * 3. Verify that the user is redirected to the dashboard after login.
 * 4. Navigate to the profile page.
 * 5. Click the delete button to delete the user profile.
 * 6. Handle the confirmation alert and accept the deletion.
 * 7. Verify that the user is redirected to the homepage after deletion.
 * 
 * @assertion The test asserts that the profile is successfully deleted, 
 *            and the user is redirected to the homepage.
 */

// Import necessary modules
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');

// Import user credentials from the Profile.json file
const credentials = require('./Profile.json');

const LOGIN_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/';
const DASHBOARD_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/jobapplication';
const PROFILE_URL = 'https://hirewire-app-8efe6492bdf7.herokuapp.com/userprofile';
const TIMEOUT = 30000;

describe('User Profile Deletion Functionality Test', function () {
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
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {
            // Handle navigation error
        }
    }

    /**
     * @function navigateToProfilePage
     * @description Navigates to the user's profile page.
     * @throws Error if the page cannot be loaded.
     */
    async function navigateToProfilePage() {
        try {
            await driver.get(PROFILE_URL);
        } catch (error) {
            // Handle navigation error
        }
    }

    async function navigateToDashboard() {
        await driver.get(DASHBOARD_URL);
    }

    /**
     * @function logoutIfLoggedIn
     * @description Logs out the user if they are logged in.
     * @throws Error if logout action cannot be performed.
     */
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.xpath('//button[@type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000); // Wait for the login page to load
            }
        } catch (error) {
            // Ignored if logout button is not found
        }
    }

    // Ensure the user is logged out after each test
    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    credentials.forEach((user, index) => {
        it(`Test case ${index + 1}`, async () => {
            // Step 1: Ensure the user is logged out if already logged in
            await logoutIfLoggedIn();

            // Step 2: Log in using valid credentials from the Profile.json file
            await navigateToLoginPage();
            const loginBtn = await driver.findElement(By.className('login-button'));
            await loginBtn.click();

            await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
            const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
            await submitButton.click();


            // Step 3: Verify that the user is redirected to the dashboard after login
            await driver.sleep(1000);
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, DASHBOARD_URL, `User cannot log in, user does not exist`);

            // Step 4: Navigate to the profile page
            await navigateToProfilePage();

            // Step 5: Click the delete button to delete the user profile
            // const deleteButton = await driver.findElement(By.xpath('//button[contains(@class, "delete-user-profile-button") and @type="button"]'));
            // await deleteButton.click();

            const deleteButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(@class, "delete-user-profile-button") and @type="button"]')), TIMEOUT);
            await deleteButton.click();
            

            // Step 6: Handle the confirmation alert and accept the deletion
            await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert pop-up to appear
            const alert = await driver.switchTo().alert();
            await alert.accept();

             await driver.wait(until.urlIs(LOGIN_URL), 2000);
            // Step 7: Verify that the user is redirected to the homepage after deletion
            const currentUrl2 = await driver.getCurrentUrl();
            assert.strictEqual(LOGIN_URL, currentUrl2, "After successful deletion of the user, the page should be directed to the homepage");
        });
    });
});
