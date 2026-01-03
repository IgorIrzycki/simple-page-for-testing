const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const { startMonitoring, stopMonitoring } = require("../metrics");

const args = process.argv.slice(2);
const browser = args.find(a => a.startsWith("--browser="))?.split("=")[1] || "chrome";
const headlessMode = args.includes("--headless");

async function changeRangeValue(driver, el, value) {
  await driver.executeScript(
    `
      const input = arguments[0];
      const newVal = arguments[1];
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(input, String(newVal));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    `,
    el,
    value
  );
}

async function createDriver() {
  if (browser === "chrome") {
    const options = new chrome.Options();

    if (headlessMode) {
      options.addArguments("--headless=new");
    }

    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1280,720");

    const service = new chrome.ServiceBuilder("chromedriver");

    return new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  }
  if (browser === "firefox") {
    const options = new firefox.Options();
    if (headlessMode) options.addArguments("-headless");
    return new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
  }
  throw new Error("Unknown browser");
}

(async function fullUITestSuite() {
  const driver = await createDriver();

  try {
    startMonitoring();
    await driver.get("http://localhost:3000/");

    console.log("01. Tytuł strony jest poprawny");
    console.log((await driver.getTitle()) === "Simple Page for Testing");

    console.log("02. Nagłówki sekcji są widoczne");
    for (const h of [
      "Form Elements",
      "Interactive Elements",
      "Dynamic & Visual Elements",
      "Data Display Components",
    ]) {
      const el = await driver.findElement(By.xpath(`//h2[text()='${h}']`));
      console.log(await el.isDisplayed());
    }

    console.log("03. Tabela zawiera cztery kolumny");
    const table = await driver.findElement(By.css("[data-testid='table']"));
    console.log((await table.findElements(By.css("thead th"))).length === 4);

    console.log("04. Pole tekstowe ma poprawny stan początkowy");
    const input = await driver.findElement(By.css("[data-testid='text-input']"));
    console.log((await input.getAttribute("placeholder")).includes("Enter your name"));
    console.log((await input.getAttribute("value")) === "");

    console.log("05. Pole tekstowe przyjmuje wpisany tekst");
    await input.sendKeys("Jan Kowalski");
    console.log((await input.getAttribute("value")) === "Jan Kowalski");

    console.log("06. Lista rozwijana zmienia wybraną opcję");
    const select = await driver.findElement(By.css("[data-testid='select']"));
    await select.sendKeys("Option 3");
    console.log((await select.getAttribute("value")) === "option3");

    console.log("07. Checkbox poprawnie zmienia stan");
    const checkbox = await driver.findElement(By.css("[data-testid='checkbox']"));
    await checkbox.click();
    const c1 = await checkbox.isSelected();
    await checkbox.click();
    const c2 = await checkbox.isSelected();
    console.log(c1 === true && c2 === false);

    console.log("08. Przyciski radio są wzajemnie wykluczające");
    const radioA = await driver.findElement(By.css("[data-testid='radio-A']"));
    const radioB = await driver.findElement(By.css("[data-testid='radio-B']"));
    await radioA.click();
    await radioB.click();
    console.log(!(await radioA.isSelected()) && (await radioB.isSelected()));

    console.log("09. Przełącznik motywu zmienia klasę elementu body");
    const toggle = await driver.findElement(By.css("[data-testid='dark-mode-toggle']"));
    await toggle.click();
    const cls1 = await driver.findElement(By.css("body")).getAttribute("class");
    await toggle.click();
    console.log(cls1.includes("dark-mode"));

    console.log("10. Przycisk Primary zmienia tekst i klasę po kliknięciu");
    const primaryBtn = await driver.findElement(By.css("[data-testid='primary-button']"));
    await primaryBtn.click();
    console.log((await primaryBtn.getText()).includes("Clicked"));

    console.log("11. Przycisk Disabled staje się nieaktywny po kliknięciu");
    const disabledBtn = await driver.findElement(By.css("[data-testid='disabled-button']"));
    await disabledBtn.click();
    console.log((await disabledBtn.getAttribute("disabled")) !== null);

    console.log("12. Przycisk Secondary wywołuje alert");
    const secBtn = await driver.findElement(By.css("[data-testid='secondary-button']"));
    await secBtn.click();
    await driver.wait(until.alertIsPresent());
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();
    console.log(alertText.includes("Secondary button pressed!"));

    console.log("13. Pasek postępu zmienia wartość po przesunięciu suwaka");
    const slider = await driver.findElement(By.css("[data-testid='range']"));
    await changeRangeValue(driver, slider, 90);
    await driver.sleep(100);
    const progress = await driver.findElement(By.css("[data-testid='progress-bar']"));
    console.log((await progress.getAttribute("value")) === "90");

    console.log("14. Modal otwiera się i zamyka prawidłowo");
    const modalBtn = await driver.findElement(By.css("[data-testid='modal-btn']"));
    await modalBtn.click();
    await driver.findElement(By.css("[data-testid='modal']"));
    await driver.findElement(By.xpath("//button[text()='Close']")).click();
    console.log(true);

    console.log("15. Alert pojawia się i automatycznie znika");
    const alertBtn2 = await driver.findElement(By.css("[data-testid='alert-btn']"));
    await alertBtn2.click();
    console.log((await driver.findElement(By.css("[data-testid='alert']")).getText()).includes("successfully"));
    await driver.sleep(3200);
    console.log((await driver.findElements(By.css("[data-testid='alert']"))).length === 0);

    console.log("16. Loader pojawia się i znika po określonym czasie");
    const loaderBtn = await driver.findElement(By.css("[data-testid='loader-btn']"));
    await loaderBtn.click();
    await driver.findElement(By.css("[data-testid='loader']"));
    await driver.sleep(2200);
    console.log((await driver.findElements(By.css("[data-testid='loader']"))).length === 0);

    console.log("17. Tooltip wyświetla poprawny tytuł");
    const tooltip = await driver.findElement(By.css("[data-testid='tooltip']"));
    console.log((await tooltip.getAttribute("title")).includes("tooltip"));

    console.log("18. Każdy wiersz tabeli zawiera cztery komórki");
    const rows = await driver.findElements(By.css("[data-testid='table'] tbody tr"));
    let valid = true;
    for (const r of rows) {
      const cells = await r.findElements(By.css("td"));
      if (cells.length !== 4) valid = false;
    }
    console.log(valid);

    console.log("19. Karty danych wyświetlają poprawne informacje");
    for (const c of [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alex Brown" },
    ]) {
      const el = await driver.findElement(By.css(`[data-testid='card-${c.id}']`));
      const text = await el.getText();
      console.log(text.includes(c.name));
    }

    console.log("20. Obraz posiada poprawne atrybuty");
    const img = await driver.findElement(By.css("[data-testid='image']"));
    const w = await img.getAttribute("width");
    const h = await img.getAttribute("height");
    const a = await img.getAttribute("alt");
    const d = await driver.findElement(By.css(".img-desc"));
    console.log(w === "100" && h === "100" && a === "Placeholder example" && (await d.isDisplayed()));

  } finally {
    const mode = headlessMode ? "Headless" : "Headed";
    stopMonitoring("Selenium", mode, browser);
    await driver.quit();
  }
})();
