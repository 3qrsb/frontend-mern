"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
const chromedriver_1 = __importDefault(require("chromedriver"));
const chai_1 = require("chai");
describe("E2E: Product Detail → Cart → Unauthorized Checkout", function () {
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
    it("loads the product detail page and adds to cart", async () => {
        await driver.get("http://localhost:3000/products/680252f69298613f76a0e741");
        const addButton = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='add-to-cart-button']")), 10000, "Timed out waiting for Add to Cart button on detail page");
        await addButton.click();
        const badge = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='cart-badge']")), 5000, "Timed out waiting for cart badge");
        (0, chai_1.expect)(await badge.getText()).to.equal("1");
    });
    it("goes to cart and clicking Place Order redirects to login", async () => {
        await driver.get("http://localhost:3000/cart");
        const placeOrder = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("[data-testid='goto-place-order-button']")), 5000, "Timed out waiting for Place Order button");
        await placeOrder.click();
        await driver.wait(selenium_webdriver_1.until.urlContains("/login"), 10000, "Timed out waiting for redirect to /login");
        (0, chai_1.expect)(await driver.getCurrentUrl()).to.include("/login");
    });
});
