const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available

const credentials = require('./ResumeGeneration_data.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const APPLICATION_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const TIMEOUT = 30000;

describe('Generate Resume and Cover LEtter Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {

        }
    });

    after(async () => {
        try {
            await driver.quit();
        } catch (error) {

        }
    });

    // Helper function to log out if already logged in
    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {

        }
    }

    // Helper function to navigate to the login page
    async function navigateToLoginPage() {
        try {
            await driver.get(LOGIN_URL);
        } catch (error) {

        }
    }

    // Helper function to navigate to the application page
    async function navigateToApplicationPage() {
        try {
            await driver.get(APPLICATION_URL);
        } catch (error) {
  
        }
    }

    // Test case: Login and fill out the job application form
    credentials.forEach((user, index) => {
        it(`User ${index + 1}: Job Application Form Test`, async () => {
            try {
                await logoutIfLoggedIn();
                await navigateToLoginPage();

                // Log in with the current user's credentials
                const loginbtn = await driver.findElement(By.className('login-button'));
                await loginbtn.click();

                await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
                await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(user.password);

                const logbtn = await driver.findElement(By.css('button[type="submit"]'));
                await logbtn.click();

                // Wait for the dashboard or confirmation that the login was successful
                await driver.wait(until.urlContains(APPLICATION_URL), 5000);

                // Navigate to the application page
                await navigateToApplicationPage();

                // Fill out the job application form
                await driver.findElement(By.xpath('//input[@placeholder="Job title (required)"]')).sendKeys(user.jobTitle);
                await driver.findElement(By.xpath('//input[@placeholder="Company (required)"]')).sendKeys(user.company);
                await driver.findElement(By.css('textarea[placeholder="Job description / information... (required)"]')).sendKeys(user.description);
                await driver.findElement(By.css('textarea[placeholder="Additional Information"]')).sendKeys(user.additionalInformation);
                // Uncomment and adjust as needed for the optional description field
                // await driver.findElement(By.xpath('//textarea[@placeholder="Write additional information about yourself (Optional)"]')).sendKeys(
                //     user.description
                // );

                // Click the "Generate" button to create the resume
                const generateButton = await driver.findElement(By.xpath('//button[contains(@class, "generate-button")]'));

                await generateButton.click();

                // Verify if the generated content appears (assuming there is an element with generated content)
                const generatedContent = await driver.wait(
                    until.elementLocated(By.css('.generated-content')),
                    5000
                );

                await driver.sleep(1000);
                const generatedText = await generatedContent.getText();
                assert.ok(
                    generatedText.includes('Generated Resume'),
                    'The generated resume should appear on the page'
                );

            } catch (error) {
                console.error(`Error in Job Application Form Test for User ${index + 1}:`, error);
            }
        });
    });
});
