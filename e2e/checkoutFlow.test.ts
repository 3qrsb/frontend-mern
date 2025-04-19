import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { ServiceBuilder, Options } from "selenium-webdriver/chrome";
import chromedriver from "chromedriver";
import { expect } from "chai";

describe("E2E: Login → Products → Cart → Checkout", function () {
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

  it("logs in and lands on the home page", async () => {
    await driver.get("http://localhost:3000/login");

    await driver.findElement(By.name("email")).sendKeys("eabuov4@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("eabuov4@gmail.com");
    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(
      until.urlIs("http://localhost:3000/"),
      10000,
      "Timed out waiting to be redirected to home page after login"
    );
  });

  it("adds a product and verifies it shows in the cart badge", async () => {
    await driver.get("http://localhost:3000/products");
    await driver.wait(
      until.elementLocated(By.css("[data-testid='product-card']")),
      10000
    );

    await driver.findElement(By.css("[data-testid='product-card']")).click();
    await driver.wait(
      until.elementLocated(By.css("[data-testid='add-to-cart-button']")),
      5000
    );
    await driver
      .findElement(By.css("[data-testid='add-to-cart-button']"))
      .click();

    const badge = await driver.wait(
      until.elementLocated(By.css("[data-testid='cart-badge']")),
      5000
    );
    expect(await badge.getText()).to.equal("1");
  });

  it("goes to cart and clicks Place Order", async () => {
    await driver.get("http://localhost:3000/cart");

    await driver.wait(
      until.elementLocated(By.css("[data-testid='goto-place-order-button']")),
      5000
    );
    await driver
      .findElement(By.css("[data-testid='goto-place-order-button']"))
      .click();

    await driver.wait(
      until.urlContains("/place-order"),
      5000,
      "Timed out waiting for /place-order URL"
    );
  });

  it("selects a shipping address, places the order, and lands on Stripe", async () => {
    await driver
      .wait(
        until.elementLocated(By.css("[data-testid='select-address-button']")),
        5000
      )
      .click();

    await driver.wait(
      until.elementLocated(By.css("[data-testid='address-card']")),
      5000
    );
    await driver.findElement(By.css("[data-testid='address-card']")).click();

    await driver.wait(
      until.elementLocated(By.css("[data-testid='place-order-button']")),
      5000
    );
    await driver
      .findElement(By.css("[data-testid='place-order-button']"))
      .click();

    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("stripe.com"),
      10000,
      "Timed out waiting for redirect to Stripe"
    );
    expect(await driver.getCurrentUrl()).to.include("stripe.com");
  });
});
