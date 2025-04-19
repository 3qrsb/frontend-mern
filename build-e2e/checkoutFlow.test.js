"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
const chromedriver_1 = __importDefault(require("chromedriver"));
const chai_1 = require("chai");
describe("E2E: Login → Products → Cart → Checkout", function () {
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
    it("logs in and lands on the home page", async () => {
        await driver.get("http://localhost:3000/login");
        await driver.findElement(selenium_webdriver_1.By.name("email")).sendKeys("eabuov4@gmail.com");
        await driver.findElement(selenium_webdriver_1.By.name("password")).sendKeys("eabuov4@gmail.com");
        await driver.findElement(selenium_webdriver_1.By.css("button[type='submit']")).click();
        await driver.wait(selenium_webdriver_1.until.urlIs("http://localhost:3000/"), 10000, "Timed out waiting to be redirected to home page after login");
    });
    it("adds a product and verifies it shows in the cart badge", async () => {
        await driver.get("http://localhost:3000/products");
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='product-card']")), 10000);
        await driver.findElement(selenium_webdriver_1.By.css("[data-testid='product-card']")).click();
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='add-to-cart-button']")), 5000);
        await driver
            .findElement(selenium_webdriver_1.By.css("[data-testid='add-to-cart-button']"))
            .click();
        const badge = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='cart-badge']")), 5000);
        (0, chai_1.expect)(await badge.getText()).to.equal("1");
    });
    it("goes to cart and clicks Place Order", async () => {
        await driver.get("http://localhost:3000/cart");
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='goto-place-order-button']")), 5000);
        await driver
            .findElement(selenium_webdriver_1.By.css("[data-testid='goto-place-order-button']"))
            .click();
        await driver.wait(selenium_webdriver_1.until.urlContains("/place-order"), 5000, "Timed out waiting for /place-order URL");
    });
    it("selects a shipping address, places the order, and lands on Stripe", async () => {
        await driver
            .wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='select-address-button']")), 5000)
            .click();
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='address-card']")), 5000);
        await driver.findElement(selenium_webdriver_1.By.css("[data-testid='address-card']")).click();
        await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='place-order-button']")), 5000);
        await driver
            .findElement(selenium_webdriver_1.By.css("[data-testid='place-order-button']"))
            .click();
        await driver.wait(async () => (await driver.getCurrentUrl()).includes("stripe.com"), 10000, "Timed out waiting for redirect to Stripe");
        (0, chai_1.expect)(await driver.getCurrentUrl()).to.include("stripe.com");
    });
});
