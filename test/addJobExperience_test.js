

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');
const credentials = require('./Profile.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const EXPERIENCE_URL = 'http://localhost:3000/hire-wire-front-end/experience';
const TIMEOUT = 30000;

describe('Add Job Experience Functionality Test', function () {
    this.timeout(TIMEOUT);
    
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    async function navigateToPage(url) {
        await driver.get(url);
    }

    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(LOGIN_URL), 5000);
            }
        } catch (error) {
            // Ignore if logout button is not found
        }
    }

    async function login(user) {
        await navigateToPage(LOGIN_URL);
        const loginBtn = await driver.findElement(By.className('login-button'));
        await loginBtn.click();

        // Enter login credentials
        await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(user.password);
        const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
        await submitBtn.click();

        // Wait for the dashboard to load
        await driver.wait(until.urlContains(DASHBOARD_URL), 5000);
    }


    async function fillExperienceForm(experience) {
        // Click "Add Experience" button
        await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Experience"]')).click();

        // Fill in the job experience details if available
        if (experience.JobTitle) {
            const jobTitleInput = await driver.findElement(By.xpath('//label[text()="Job Title"]/following-sibling::input'));
            await jobTitleInput.sendKeys(experience.JobTitle);
        }
        if (experience.organizationName) {
            const orgNameInput = await driver.findElement(By.xpath('//label[text()="Organization Name"]/following-sibling::input'));
            await orgNameInput.sendKeys(experience.organizationName);
        }
        if (experience.startDate) {
            const startDateInput = await driver.findElement(By.xpath('//label[text()="Start Date"]/following-sibling::input[@type="date"]'));
            //const formattedStartDate = formatDateTo6Digit(experience.startDate);
            await startDateInput.sendKeys(experience.startDate); // Send the formatted date (yyyymmdd)
        }
        
        if (experience.endDate) {
            const endDateInput = await driver.findElement(By.xpath('//label[text()="End Date"]/following-sibling::input[@type="date"]'));
           // const formattedEndDate = formatDateTo6Digit(experience.endDate);
            await endDateInput.sendKeys(experience.endDate); // Send the formatted date (yyyymmdd)
        }
        
        if (experience.description) {
            const descriptionInput = await driver.findElement(By.xpath('//label[text()="Description"]/following-sibling::textarea'));
            await descriptionInput.sendKeys(experience.description);
        }

        // Save the experience entry
        const saveBtn = await driver.findElement(By.css('button.save-button'));
        await saveBtn.click();

        
        // Verify success message
        //await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Experience saved successfully")]')), 5000);
    }


    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    credentials.forEach((user, index) => {
        it(`User Profile Testt Case ${index + 1}`, async () => {
            await logoutIfLoggedIn();
            await login(user);

            // Verify user is on the dashboard
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

            //Go to the Experience Page and fill the form
            await navigateToPage(EXPERIENCE_URL);
            for (const experience of user.workExperience) {
                await fillExperienceForm(experience);
            }
        });
    });
});
