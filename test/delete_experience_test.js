

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

describe('Delete EXperience from User Profile Functionality Test', function () {
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

    async function navigateToExperiencePage() {
        try {
            await driver.get(EXPERIENCE_URL);
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
        
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`User  ${index + 1}`, async () => {
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


                // Navigate to profile page
                await navigateToExperiencePage();

                // Click delete Button
                const deleteButton = await driver.findElement(By.xpath('//button[contains(@class, "remove-button") and @type="button"]'));
                await deleteButton.click();

            } catch (error) {
                console.error(`Error in User Profile Test ${index + 1}:`, error);
            }
        });
    });
});
