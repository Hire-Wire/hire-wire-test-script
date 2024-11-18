const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available
const fs = require('fs');


const credentials = require('./LoginAndProfile_data.json');
// console.log("Password (dynamic access):", credentials["password"]);

console.log("Username:", credentials.emailAddress);
console.log("Password:", credentials.password);


const LOGIN_URL = 'http://localhost:3000/hire-wire-front-end';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/application';
const PROFILE_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const TIMEOUT = 30000;

describe('User Prrofile Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    // Helper function to navigate to the login page
    async function navigateToLoginPage() {
        await driver.get(LOGIN_URL);
    }

    async function navigateToProfilePage() {
        await driver.get(PROFILE_URL);
    }

    async function logoutIfLoggedIn() {
        try {
            const logoutButton = await driver.findElement(By.css('button[type="logout"]'));
            if (await logoutButton.isDisplayed()) {
                await logoutButton.click();
                await driver.wait(until.urlContains(REGISTRATION_URL), 5000);
            }
        } catch (error) {
            
        }
    }

    afterEach(async () => {
        await logoutIfLoggedIn();
    });


    console.log('User must be registered on the system first and then log in with valid credentials');
    credentials.forEach((user, index) => {
        it(`${index + 1}`, async () => {

            console.log("Username:", user.emailAddress);
            console.log("Password:", user.password);
            
            await navigateToLoginPage();
            const loginbtn = await driver.findElement(By.className('login-button'));
            await loginbtn.click();

            // Use the username and password for the current user
            await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
            await driver.findElement(By.css("input[placeholder='Password']")).sendKeys(user.password);

            // await driver.findElement(By.css('button[type = "submit")]')).click();


            const registerButton = await driver.findElement(By.css('button[type="submit"]'));
            await registerButton.click();
            
            await driver.wait(until.urlContains(DASHBOARD_URL), 5000);
            const currentUrl = await driver.getCurrentUrl();
            //assert.strictEqual(currentUrl.includes(DASHBOARD_URL), true, `User ${index + 1} should be on the dashboard page`);

  


            //goes to user profile
            await navigateToProfilePage();
           // Fill in the "First Name" field (selecting the first input of type text)
await driver.findElement(By.css('input[type="text"]')).sendKeys(user.firstName);

// Fill in the "Last Name" field (selecting the second input of type text)
await driver.findElements(By.css('input[type="text"]')).then(elements => elements[1].sendKeys(user.lastName));

// Fill in the "Phone Number" field (selecting the third input of type text)
await driver.findElements(By.css('input[type="text"]')).then(elements => elements[2].sendKeys(user.phoneNumber));

// Fill in the "Email Address" field (selecting the input of type email)
await driver.findElement(By.css('input[type="email"]')).sendKeys(user.emailAddress);

// Select "Status" from the dropdown (by visible text or by value)
await driver.findElement(By.css('select')).sendKeys(user.status);

// Click on the "Save User Profile Changes" button
const saveButton = await driver.findElement(By.css('button.save-button'));
await saveButton.click();

// Click on the "Delete User Profile" button (if needed)
// const deleteButton = await driver.findElement(By.css('button.delete-user-profile-button'));
// await deleteButton.click();

        });
    });

});
