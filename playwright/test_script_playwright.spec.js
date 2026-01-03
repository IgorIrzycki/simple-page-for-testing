import { test, expect } from "@playwright/test";
import { startMonitoring, stopMonitoring } from "../metrics.js"; 

test.describe("Zestaw testów UI Aplikacja React", () => {

  test.beforeAll(async () => {
    const mode = test.info().project.use.headless ? "Headless" : "Headed";
    startMonitoring();
    console.log(`Starting Playwright tests (${mode})...`);
  });

  test.afterAll(async () => {
    const mode = test.info().project.use.headless ? "Headless" : "Headed";
    stopMonitoring("Playwright", mode, test.info().project.name);
  });
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("01. Tytuł strony jest poprawny", async ({ page }) => {
    await expect(page).toHaveTitle("Simple Page for Testing");
  });

  test("02. Nagłówki sekcji są widoczne", async ({ page }) => {
    const headers = [
      "Form Elements",
      "Interactive Elements",
      "Dynamic & Visual Elements",
      "Data Display Components",
    ];
    for (const h of headers) {
      await expect(page.getByRole("heading", { name: h })).toBeVisible();
    }
  });

  test("03. Tabela zawiera cztery kolumny", async ({ page }) => {
    const headers = await page.locator("table thead th").allTextContents();
    expect(headers).toEqual(["ID", "User", "Role", "Status"]);
  });

  test("04. Pole tekstowe ma poprawny stan początkowy", async ({ page }) => {
    const input = page.getByTestId("text-input");
    await expect(input).toHaveAttribute("placeholder", /Enter your name/);
    await expect(input).toHaveValue("");
  });

  test("05. Pole tekstowe przyjmuje wpisany tekst", async ({ page }) => {
    const input = page.getByTestId("text-input");
    await input.fill("Jan Kowalski");
    await expect(input).toHaveValue("Jan Kowalski");
  });

  test("06. Lista rozwijana zmienia wybraną opcję", async ({ page }) => {
    const select = page.getByTestId("select");
    await select.selectOption("option3");
    await expect(select).toHaveValue("option3");
  });

  test("07. Checkbox poprawnie zmienia stan", async ({ page }) => {
    const checkbox = page.getByTestId("checkbox");
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test("08. Przyciski radio są wzajemnie wykluczające", async ({ page }) => {
    const radioA = page.getByTestId("radio-A");
    const radioB = page.getByTestId("radio-B");
    await radioA.check();
    await radioB.check();
    await expect(radioA).not.toBeChecked();
    await expect(radioB).toBeChecked();
  });

  test("09. Przełącznik motywu zmienia klasę elementu body", async ({ page }) => {
    const toggle = page.getByTestId("dark-mode-toggle");
    await toggle.click();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);
    await toggle.click();
    await expect(page.locator("body")).not.toHaveClass(/dark-mode/);
  });

  test("10. Przycisk Primary zmienia tekst i klasę po kliknięciu", async ({ page }) => {
    const btn = page.getByTestId("primary-button");
    await btn.click();
    await expect(btn).toHaveText("Clicked!");
    await expect(btn).toHaveClass(/active/);
  });

  test("11. Przycisk Disabled staje się nieaktywny po kliknięciu", async ({ page }) => {
    const btn = page.getByTestId("disabled-button");
    await btn.click();
    await expect(btn).toBeDisabled();
  });

  test("12. Przycisk Secondary wywołuje alert", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Secondary button pressed!");
      await dialog.accept();
    });
    await page.getByTestId("secondary-button").click();
  });

  test("13. Pasek postępu zmienia wartość po przesunięciu suwaka", async ({ page }) => {
    const slider = await page.getByTestId("range").elementHandle();

    await page.evaluate(({ el, value }) => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      setter.call(el, String(value));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, { el: slider, value: 90 });

    await page.waitForTimeout(100);

    const progress = page.getByTestId("progress-bar");
    await expect(progress).toHaveAttribute("value", "90");
  });

  test("14. Modal otwiera się i zamyka prawidłowo", async ({ page }) => {
    await page.getByTestId("modal-btn").click();
    const modal = page.getByTestId("modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Close" }).click();
    await expect(modal).toBeHidden();
  });

  test("15. Alert pojawia się i automatycznie znika", async ({ page }) => {
    await page.getByTestId("alert-btn").click();
    const alert = page.getByTestId("alert");
    await expect(alert).toHaveText(/successfully completed/);
    await page.waitForTimeout(3200);
    await expect(alert).toBeHidden();
  });

  test("16. Loader pojawia się i znika po określonym czasie", async ({ page }) => {
    await page.getByTestId("loader-btn").click();
    const loader = page.getByTestId("loader");
    await expect(loader).toBeVisible();
    await page.waitForTimeout(2200);
    await expect(loader).toBeHidden();
  });

  test("17. Tooltip wyświetla poprawny tytuł", async ({ page }) => {
    const tooltip = page.getByTestId("tooltip");
    await tooltip.hover();
    await expect(tooltip).toHaveAttribute("title", /tooltip/);
  });

  test("18. Każdy wiersz tabeli zawiera cztery komórki", async ({ page }) => {
    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const cells = rows.nth(i).locator("td");
      await expect(cells).toHaveCount(4);
    }
  });

  test("19. Karty danych wyświetlają poprawne informacje", async ({ page }) => {
    const cards = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alex Brown" },
    ];
    for (const card of cards) {
      const elem = page.getByTestId(`card-${card.id}`);
      await expect(elem).toContainText(card.name);
    }
  });

  test("20. Obraz posiada poprawne atrybuty", async ({ page }) => {
    const img = page.getByTestId("image");
    await expect(img).toHaveAttribute("width", "100");
    await expect(img).toHaveAttribute("height", "100");
    await expect(img).toHaveAttribute("alt", "Placeholder example");
    await expect(page.locator(".img-desc")).toBeVisible();
  });
});
