import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { ServiceBuilder, Options } from "selenium-webdriver/chrome";
import chromedriver from "chromedriver";
import { expect } from "chai";

describe("E2E Graybox: Session Control (Login → Logout)", function () {
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

  it("persists userInfo in localStorage after login and clears it on logout", async () => {
    await driver.get("http://localhost:3000/login");
    await driver.findElement(By.name("email")).sendKeys("eabuov4@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("eabuov4@gmail.com");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(
      until.urlIs("http://localhost:3000/"),
      10000,
      "Timed out waiting for home page after login"
    );

    const userInfo = await driver.executeScript<Record<string, any>>(
      "return JSON.parse(window.localStorage.getItem('userInfo'));"
    );
    expect(userInfo).to.be.an("object");
    expect(userInfo).to.include({
      _id: "680252a79298613f76a0e71a",
      name: "yerss",
      email: "eabuov4@gmail.com",
      isAdmin: true,
    });
    expect(userInfo).to.have.property("accessToken").that.is.a("string");
    expect(userInfo).to.have.property("refreshToken").that.is.a("string");

    await driver
      .findElement(By.css("[data-testid='account-menu-button']"))
      .click();
    const logoutItem = await driver.wait(
      until.elementLocated(By.css("[data-testid='logout-button']")),
      5000,
      "Logout button not found in profile menu"
    );
    await logoutItem.click();

    await driver.wait(
      until.urlContains("/login"),
      10000,
      "Timed out waiting for login page after logout"
    );

    const cleared = await driver.executeScript<string | null>(
      "return window.localStorage.getItem('userInfo');"
    );
    expect(cleared).to.be.null;
  });
});
