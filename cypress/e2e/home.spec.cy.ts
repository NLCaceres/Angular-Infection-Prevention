describe("Homepage Testing", () => {
  beforeEach(() => {
    cy.visit("/");
  })
  it("Visits the initial project page", () => {
    cy.get("a.navbar-brand").contains("Infection Protection").should("exist");
  })
  it("Visits 'Professions' list view", () => {
    //? Better to intercept and pass in a stub, so no requests are made to the backend UNLESS ABSOLUTELY NEEDED/WANTED
    cy.intercept("GET", "http://localhost:8080/professions", []).as("emptyProfessions");
    cy.get("ul.navbar-nav > li.nav-item").contains("Professions").click(); //TODO: Selectors like this are why @testing-library/cypress is VERY helpful

    cy.get("h2").contains("Hospital Professions").should("exist");
    cy.url().should("include", "/professions");
  })
  //TODO: Add other navigation as other routes are completed
})
