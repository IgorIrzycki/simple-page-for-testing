/// <reference types="cypress" />

describe("Zestaw testów UI Aplikacja React", () => {
  before(() => {
    cy.task("startMonitoring");
    cy.visit("/");
  });

  after(() => {
    const mode = Cypress.browser.isHeadless ? "Headless" : "Headed";
    cy.task("stopMonitoring", { mode, browser: Cypress.browser.name });
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("01. Tytuł strony jest poprawny", () => {
    cy.title().should("eq", "Simple Page for Testing");
  });

  it("02. Nagłówki sekcji są widoczne", () => {
    [
      "Form Elements",
      "Interactive Elements",
      "Dynamic & Visual Elements",
      "Data Display Components",
    ].forEach(h => cy.contains("h2", h).should("be.visible"));
  });

  it("03. Tabela zawiera cztery kolumny", () => {
    cy.get('[data-testid="table"] thead th').should("have.length", 4);
  });

  it("04. Pole tekstowe ma poprawny stan początkowy", () => {
    cy.get('[data-testid="text-input"]')
      .should("have.attr", "placeholder", "Enter your name...")
      .and("have.value", "");
  });

  it("05. Pole tekstowe przyjmuje wpisany tekst", () => {
    cy.get('[data-testid="text-input"]')
      .type("Jan Kowalski")
      .should("have.value", "Jan Kowalski");
  });

  it("06. Lista rozwijana zmienia wybraną opcję", () => {
    cy.get('[data-testid="select"]').select("option3").should("have.value", "option3");
  });

  it("07. Checkbox poprawnie zmienia stan", () => {
    cy.get('[data-testid="checkbox"]')
      .should("not.be.checked")
      .click().should("be.checked")
      .click().should("not.be.checked");
  });

  it("08. Przyciski radio są wzajemnie wykluczające", () => {
    cy.get('[data-testid="radio-A"]').check();
    cy.get('[data-testid="radio-B"]').check();
    cy.get('[data-testid="radio-A"]').should("not.be.checked");
    cy.get('[data-testid="radio-B"]').should("be.checked");
  });

  it("09. Przełącznik motywu zmienia klasę elementu body", () => {
    cy.get('[data-testid="dark-mode-toggle"]').click();
    cy.get("body").should("have.class", "dark-mode");
    cy.get('[data-testid="dark-mode-toggle"]').click();
    cy.get("body").should("not.have.class", "dark-mode");
  });

  it("10. Przycisk Primary zmienia tekst i klasę po kliknięciu", () => {
    cy.get('[data-testid="primary-button"]')
      .click()
      .should("have.text", "Clicked!")
      .and("have.class", "active");
  });

  it("11. Przycisk Disabled staje się nieaktywny po kliknięciu", () => {
    cy.get('[data-testid="disabled-button"]').click().should("be.disabled");
  });

  it("12. Przycisk Secondary wywołuje alert", () => {
    cy.on("window:alert", txt => {
      expect(txt).to.equal("Secondary button pressed!");
    });
    cy.get('[data-testid="secondary-button"]').click();
  });

  it("13. Pasek postępu zmienia wartość po przesunięciu suwaka", () => {
    cy.changeRangeInput('[data-testid="range"]', 90);
    cy.get('[data-testid="progress-bar"]').should("have.attr", "value", "90");
  });

  it("14. Modal otwiera się i zamyka prawidłowo", () => {
    cy.get('[data-testid="modal-btn"]').click();
    cy.get('[data-testid="modal"]').should("be.visible");
    cy.get('[data-testid="modal"] button').click();
    cy.get('[data-testid="modal"]').should("not.exist");
  });

  it("15. Alert pojawia się i automatycznie znika", () => {
    cy.get('[data-testid="alert-btn"]').click();
    cy.get('[data-testid="alert"]').should("contain.text", "successfully completed");
    cy.wait(3200);
    cy.get('[data-testid="alert"]').should("not.exist");
  });

  it("16. Loader pojawia się i znika po określonym czasie", () => {
    cy.get('[data-testid="loader-btn"]').click();
    cy.get('[data-testid="loader"]').should("be.visible");
    cy.wait(2200);
    cy.get('[data-testid="loader"]').should("not.exist");
  });

  it("17. Tooltip wyświetla poprawny tytuł", () => {
    cy.get('[data-testid="tooltip"]')
      .trigger("mouseover")
      .should("have.attr", "title")
      .and("contain", "tooltip");
  });

  it("18. Każdy wiersz tabeli zawiera cztery komórki", () => {
    cy.get('[data-testid="table"] tbody tr').each(row => {
      cy.wrap(row).find("td").should("have.length", 4);
    });
  });

  it("19. Karty danych wyświetlają poprawne informacje", () => {
    cy.get('[data-testid="card-1"]').should("contain.text", "John Doe");
    cy.get('[data-testid="card-2"]').should("contain.text", "Jane Smith");
    cy.get('[data-testid="card-3"]').should("contain.text", "Alex Brown");
  });

  it("20. Obraz posiada poprawne atrybuty", () => {
    cy.get('[data-testid="image"]')
      .should("have.attr", "width", "100")
      .and("have.attr", "height", "100")
      .and("have.attr", "alt", "Placeholder example");

    cy.get(".img-desc").should("be.visible");
  });
});
