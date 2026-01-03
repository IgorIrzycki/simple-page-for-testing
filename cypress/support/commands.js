
Cypress.Commands.add("changeRangeInput", (selector, value) => {
  cy.get(selector).then(($input) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;

    nativeInputValueSetter.call($input[0], value);

    const event = new Event("change", { bubbles: true });
    $input[0].dispatchEvent(event);
  });
});
