import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { ServiceBuilder, Options } from "selenium-webdriver/chrome";
import chromedriver from "chromedriver";
import { expect } from "chai";

describe("E2E: Product Detail → Cart → Unauthorized Checkout", function () {
  this.timeout(120000);
  let driver: WebDriver;

  before(async () => {
    const service = new ServiceBuilder(chromedriver.path);
    const options = new Options().addArguments(
      "--headless",
      "--disable-gpu",
      "--window-size=1280,1024"
    );
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeService(service)
      .setChromeOptions(options as any)
      .build();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("loads the product detail page and adds to cart", async () => {
    await driver.get("http://localhost:3000/products/680252f69298613f76a0e741");

    const addButton = await driver.wait(
      until.elementLocated(By.css("[data-testid='add-to-cart-button']")),
      10000,
      "Timed out waiting for Add to Cart button on detail page"
    );
    await addButton.click();

    const badge = await driver.wait(
      until.elementLocated(By.css("[data-testid='cart-badge']")),
      5000,
      "Timed out waiting for cart badge"
    );
    expect(await badge.getText()).to.equal("1");
  });

  it("goes to cart and clicking Place Order redirects to login", async () => {
    await driver.get("http://localhost:3000/cart");

    const placeOrder = await driver.wait(
      until.elementLocated(By.css("[data-testid='goto-place-order-button']")),
      5000,
      "Timed out waiting for Place Order button"
    );
    await placeOrder.click();

    await driver.wait(
      until.urlContains("/login"),
      10000,
      "Timed out waiting for redirect to /login"
    );
    expect(await driver.getCurrentUrl()).to.include("/login");
  });
});
