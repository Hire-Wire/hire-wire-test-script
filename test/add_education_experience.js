
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');
const fs = require('fs');
const credentials = require('./Profile.json');

const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/jobapplication';
const EXPERIENCE_URL = 'http://localhost:3000/hire-wire-front-end/experience';
const TIMEOUT = 30000;

describe('Add Education Experience to Profile Functionality Test', function () {
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


    function formatDateTo6Digit(date) {
        const [year, month, day] = date.split('-');
        // Ensure month and day are two digits (pad with leading zero if necessary)
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        // Return in the 'yyyymmdd' format
        return `${year}${formattedMonth}${formattedDay}`;
    }

    async function fillEducationForm(education) {
        // Add a new education entry
        await driver.findElement(By.xpath('//button[contains(@class, "add-button") and text()="+ Add Education"]')).click();

        if (education.SchoolName) {
            const schoolNameInput = await driver.findElement(By.xpath('//label[text()="Organization Name"]/following-sibling::input'));
            await schoolNameInput.sendKeys(education.SchoolName);
        }
        
        if (education.AreaOfStudy) {
            const areaOfStudyInput = await driver.findElement(By.xpath('//label[text()="Field of Study"]/following-sibling::input'));
            await areaOfStudyInput.sendKeys(education.AreaOfStudy);
        }
        
        if (education.startDate) {
            const startDateInput = await driver.findElement(By.xpath('//label[text()="Start Date"]/following-sibling::input[@type="date"]'));
            //const formattedStartDate = formatDateTo6Digit(education.startDate);
            await startDateInput.sendKeys(education.startDate); // Send the formatted date (yyyymmdd)
        }
        
        if (education.endDate) {
            const endDateInput = await driver.findElement(By.xpath('//label[text()="End Date"]/following-sibling::input[@type="date"]'));
            //const formattedEndDate = formatDateTo6Digit(education.endDate);
            await endDateInput.sendKeys(education.endDate); // Send the formatted date (yyyymmdd)
        }
        
        if (education.degree) {
            const descriptionInput = await driver.findElement(By.xpath('//label[text()="Degree"]/following-sibling::input'));
            await descriptionInput.sendKeys(education.degree);
        }

        if (education.grade) {
            const areaOfStudyInput = await driver.findElement(By.xpath('//label[text()="Grade"]/following-sibling::input'));
            await areaOfStudyInput.sendKeys(education.grade);
        }
        // Save the education entry
        const saveBtnEducation = await driver.findElement(By.xpath('//button[contains(@class, "save-button")]'));
        await saveBtnEducation.click();
    }
    afterEach(async () => {
        await logoutIfLoggedIn();
    });

    console.log('User must be registered on the system first and then log in with valid credentials');
    
    credentials.forEach((user, index) => {
        it(`User ${index + 1}`, async () => {
            await logoutIfLoggedIn();
            await login(user);

            // Verify user is on the dashboard
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

            // Go to the Experience Page and fill the form
            await navigateToPage(EXPERIENCE_URL);
            for (const education of user.Education) {
                await fillEducationForm(education);
            }
        });
    });
});
