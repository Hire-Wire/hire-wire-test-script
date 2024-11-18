const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver'); // Ensure chromedriver is available

const REGISTRATION_URL = 'http://localhost:3000/hire-wire-front-end/registration';
const DASHBOARD_URL = 'http://localhost:3000/hire-wire-front-end/userprofile';
const TIMEOUT = 30000;
const credentials = require('./Profile.json');


describe('User Registration Functionality Test', function () {
    this.timeout(TIMEOUT);

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    async function navigateToRegistrationPage() {
        await driver.get(REGISTRATION_URL);
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


    console.log('User must have valid Email ');
    credentials.forEach((user, index) => {
    it(`Test Case ${index + 1}: Login with provided credentials`,  async () => {

        await navigateToRegistrationPage();
        console.log("Email:", user.emailAddress);
        console.log("FirstNAme:", user.firstName);

        await driver.findElement(By.css('input[placeholder="First Name"]')).sendKeys(user.firstName);
        await driver.findElement(By.css('input[placeholder="Last Name"]')).sendKeys(user.lastName);
        await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(user.emailAddress);
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(user.password);
        await driver.findElement(By.css('input[placeholder="Re-enter Password"]')).sendKeys(user.confirmPassword);
        //await driver.findElement(By.css('input[placeholder="Phone Number (optional)"]')).sendKeys(user.firstName);

        const registerButton = await driver.findElement(By.css('button[type="submit"]'));
        await registerButton.click();

        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, DASHBOARD_URL, "After successful sign in user should be able to go to user profile page")

        // Check if an error message appears or redirect to a success page
    //     const errorMessage = await driver.findElements(By.css('.error-message'));
    //     if (errorMessage.length) {
    //         const errorText = await errorMessage[0].getText();
    //         assert.strictEqual(errorText, "We're sorry, we couldn't sign you up", 'Expected error message on registration failure');
    //     } else                 

    //     if (currentUrl === DASHBOARD_URL) {
    //         assert.strictEqual(currentUrl, "Login successful ", 'Moved to profile page');
    // }
    //     else {
    //         const currentUrl = await driver.getCurrentUrl();
    //         assert.notStrictEqual(currentUrl, DASHBOARD_URL, "registration successfull");
    //     }
    });
});

   
});
