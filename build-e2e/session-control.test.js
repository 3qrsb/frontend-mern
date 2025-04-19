"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
const chromedriver_1 = __importDefault(require("chromedriver"));
const chai_1 = require("chai");
describe("E2E Graybox: Session Control (Login → Logout)", function () {
    this.timeout(120000);
    let driver;
    before(async () => {
        const service = new chrome_1.ServiceBuilder(chromedriver_1.default.path);
        const options = new chrome_1.Options().addArguments("--headless", "--disable-gpu", "--window-size=1280,1024");
        driver = await new selenium_webdriver_1.Builder()
            .forBrowser("chrome")
            .setChromeService(service)
            .setChromeOptions(options)
            .build();
    });
    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });
    it("persists userInfo in localStorage after login and clears it on logout", async () => {
        // 1️⃣ Log in
        await driver.get("http://localhost:3000/login");
        await driver.findElement(selenium_webdriver_1.By.name("email")).sendKeys("eabuov4@gmail.com");
        await driver.findElement(selenium_webdriver_1.By.name("password")).sendKeys("eabuov4@gmail.com");
        await driver.findElement(selenium_webdriver_1.By.css("button[type='submit']")).click();
        await driver.wait(selenium_webdriver_1.until.urlIs("http://localhost:3000/"), 10000, "Timed out waiting for home page after login");
        // 2️⃣ Verify localStorage.userInfo exists and has the expected shape
        const userInfo = await driver.executeScript("return JSON.parse(window.localStorage.getItem('userInfo'));");
        (0, chai_1.expect)(userInfo).to.be.an("object");
        (0, chai_1.expect)(userInfo).to.include({
            _id: "680252a79298613f76a0e71a",
            name: "yerss",
            email: "eabuov4@gmail.com",
            isAdmin: true,
        });
        (0, chai_1.expect)(userInfo).to.have.property("accessToken").that.is.a("string");
        (0, chai_1.expect)(userInfo).to.have.property("refreshToken").that.is.a("string");
        // 3️⃣ Open the account menu
        await driver
            .findElement(selenium_webdriver_1.By.css("[data-testid='account-menu-button']"))
            .click();
        // 4️⃣ Click the logout item
        const logoutItem = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='logout-button']")), 5000, "Logout button not found in profile menu");
        await logoutItem.click();
        // 5️⃣ Wait for redirect to /login
        await driver.wait(selenium_webdriver_1.until.urlContains("/login"), 10000, "Timed out waiting for login page after logout");
        // 6️⃣ Verify localStorage.userInfo has been cleared
        const cleared = await driver.executeScript("return window.localStorage.getItem('userInfo');");
        (0, chai_1.expect)(cleared).to.be.null;
    });
});
