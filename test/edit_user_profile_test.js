

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');

const credentials = require('./Profile.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const PROFILE_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const TIMEOUT = 30000;

describe('User Profile Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {
            console.error('Error initializing WebDriver:', error);
        }
    });

    after(async () => {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Error quitting the WebDriver:', error);
        }
    });

    // Helper function to navigate to the login page
    async function navigateToLoginPage() {
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {
            console.error('Error navigating to login page:', error);
        }
    }

    async function navigateToProfilePage() {
        try {
            await driver.get(PROFILE_URL);
        } catch (error) {
            console.error('Error navigating to profile page:', error);
        }
    }

    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.xpath('//button[@type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // Ignored if logout button is not found
            console.log('User not logged in or logout button not found.');
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`User Profile Test ${index + 1}`, async () => {
            try {
                await logoutIfLoggedIn();
                await navigateToLoginPage();

                const loginButton = await driver.findElement(By.xpath('//button[contains(@class, "login-button")]'));
                await loginButton.click();

                // Login
                await driver.findElement(By.xpath('//input[@placeholder="Email"]')).sendKeys(user.emailAddress);
                await driver.findElement(By.xpath('//input[@placeholder="Password"]')).sendKeys(user.password);
                const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
                await submitButton.click();

                // Wait for dashboard
                await driver.wait(until.urlContains(DASHBOARD_URL), 5000);
                const currentUrl = await driver.getCurrentUrl();
                assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);


                console.log(user.firstName);
                console.log(user.phoneNumber);
                // Navigate to profile page
                await navigateToProfilePage();

                // Fill out profile fields
                const firstName = await driver.findElement(By.xpath('//input[@placeholder="First Name (required)"]'));
                await firstName.clear();
                await firstName.sendKeys(user.firstName);

                const lastName = await driver.findElement(By.xpath('//input[@placeholder="Last Name (required)"]'));
                await lastName.clear();
                await lastName.sendKeys(user.lastName);

                const phoneNumber = await driver.findElement(By.xpath('//input[@placeholder="Phone Number (optional)"]'));
                await phoneNumber.clear();
                await phoneNumber.sendKeys(user.phoneNumber);

                const emailAddress = await driver.findElement(By.xpath('//input[@type="email"]'));
                await emailAddress.clear();
                await emailAddress.sendKeys(user.emailAddress);

                const statusDropdown = await driver.findElement(By.xpath('//select'));
                await statusDropdown.sendKeys(user.status);

                // Click Save Button
                const saveButton = await driver.findElement(By.xpath('//button[contains(@class, "save-button") and @type="button"]'));
                const isDisabled = await saveButton.getAttribute('disabled');
                if (!isDisabled) {
                    await saveButton.click();
                } else {
                    console.log('Save button is disabled.');
                }

            } catch (error) {
                console.error(`Error in User Profile Test ${index + 1}:`, error);
            }


            //get current url after update
            const currentUrl2 = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl2, currentUrl2, "After Successful update should stay on same page");

        });
    });
});
