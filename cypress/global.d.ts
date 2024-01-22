declare namespace Cypress {
  interface Chainable {
    dataCy(dataCyAttribute: string): Chainable<JQuery<HTMLElement>>;
  }
}