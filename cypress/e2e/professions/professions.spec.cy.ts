
describe("Profession Pages Testing", () => {
  beforeEach(() => { //? Cypress prefers to use ONLY beforeEach, resetting state in it if needed
    cy.visit("/");
    cy.intercept("GET", "http://localhost:8080/professions",
      { body: [{ _id: 1, observedOccupation: "Clinic", serviceDiscipline: "Nurse" }, { _id: 2, observedOccupation: "Clinic", serviceDiscipline: "Doctor" }] }
    ).as("getProfessions");
    cy.get("ul.navbar-nav > li.nav-item > a.nav-link").contains("Professions").click();
  })

  //! Professions ListView
  context("Professions List Page", () => {
    it("Renders 'Professions' List Page with two professions", () => {
      cy.get("h2").contains("Hospital Professions");
      cy.url().should("include", "/professions");
      cy.dataCy("professionList").find("li").should("have.length", 2); //? Grab the "ul" parent to "find" its "li" children and count them
    })
    context("Render error message if unable to retrieve list due to", () => {
      it("Unknown issue", () => {
        cy.intercept("GET", "http://localhost:8080/professions", { forceNetworkError: true }).as("err");
        cy.visit("/professions");
        //? Testing for Disappearance in Cypress: 1. Test the elem is in the View. 2. Test (and wait) for it to be removed from the View
        cy.contains("Getting the list of professions failed due to an unknown issue").should("exist");
        cy.contains("Getting the list of professions failed due to an unknown issue", { timeout: 5100 }).should("not.exist");
      })
      it("Server issue", () => {
        cy.intercept("GET", "http://localhost:8080/professions", { statusCode: 503 }).as("err");
        cy.visit("/professions");
        cy.contains("Getting the list of professions failed due to a server issue").should("exist");
        cy.contains("Getting the list of professions failed due to a server issue", { timeout: 5100 }).should("not.exist");
      })
      it("Client Request issue", () => {
        cy.intercept("GET", "http://localhost:8080/professions", { statusCode: 404 }).as("err");
        cy.visit("/professions");
        cy.contains("Getting the list of professions failed due to an issue with your request").should("exist");
        cy.contains("Getting the list of professions failed due to an issue with your request", { timeout: 5100 }).should("not.exist");
      })
    })
  })

  //! Add Profession page
  it("Add new profession to list, showing alert to track Creation Request process", () => {
    cy.get("button").contains("Add Profession").click();

    cy.url().should("include", "/professions/add");
    cy.get("h2").contains("Add New Profession");

    //? Cypress generally prefers to use data-cy attributes for finding HTML elements OR, occasionally, contains("Some Text")
    cy.get("label").contains("Observed Occupation");
    cy.get("[data-cy='observedOccupation']").type("Clinic");
    cy.get("[data-cy='observedOccupation']").should("have.value", "Clinic");

    cy.get("label").contains("Service Discipline");
    cy.get("[data-cy='serviceDiscipline']").type("Nurse");
    cy.get("[data-cy='serviceDiscipline']").should("have.value", "Nurse");

    cy.intercept("POST", "http://localhost:8080/professions/create",
      (req) => { req.on("response", (res) => { res.setDelay(1000) }); req.reply("") }
    ).as("addProfession");
    cy.get("button").contains("Add").click();
    cy.contains("Attempting to add new profession data point"); //? Careful! Queries are case-sensitive

    cy.wait("@addProfession").its("request.body").should("deep.equal", { observedOccupation: "Clinic", serviceDiscipline: "Nurse" });
    cy.url().should("include", "/professions");
    cy.get("h2").contains("Hospital Professions");
  })

  context("In 'Profession Detail' Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "http://localhost:8080/profession/1", { _id: 1, observedOccupation: "Clinic", serviceDiscipline: "Nurse" }).as("getProfession");
      cy.get("a").contains("Clinic Nurse").click();
      cy.url().should("include", "/profession/1");
    })
    it("Edit the profession's observed occupation, then submit the form", () => {
      cy.wait("@getProfession"); //? Helps ensure proper page load every time
      cy.get("input#observedOccupation").clear();
      cy.get("input#observedOccupation").type("Hospital");
      cy.get("input#observedOccupation").should("have.value", "Hospital");

      //? Stubbing the response to an empty string prevents a POST/PUT request from actually being sent
      cy.intercept("PUT", "http://localhost:8080/profession/1", "").as("updateProfession");
      cy.get("form").submit(); //* WHEN form submitted

      //* THEN navigates to main professions list
      cy.url().should("include", "/professions");
      cy.get("@updateProfession").its("request.body")
        .should("deep.equal", { _id: 1, observedOccupation: "Hospital", serviceDiscipline: "Nurse" });
    })
    it("Edit the profession's observed occupation, then submit by pressing 'Enter' from a focused input", () => {
      cy.wait("@getProfession");
      cy.intercept("PUT", "http://localhost:8080/profession/1",
        (req) => { req.on("response", (res) => { res.setDelay(1000) }); req.reply("") }
      ).as("updateProfession");
      cy.get("input#observedOccupation").clear();
      cy.get("input#observedOccupation").type("Hospital{enter}"); //* WHEN user finishes typing and hits ENTER
      cy.get("input#observedOccupation").should("have.value", "Hospital");
      cy.contains("Attempting to update this profession data"); //* THEN an alert tracking the request's progress is shown

      //* AND the update request runs and browser navigates to Professions List
      cy.url().should("include", "/professions");
      cy.get("@updateProfession").its("request.body")
        .should("deep.equal", { _id: 1, observedOccupation: "Hospital", serviceDiscipline: "Nurse" });
    })
    it("Edit the profession's service discipline, then save", () => {
      cy.wait("@getProfession");
      cy.get("input#serviceDiscipline").clear();
      cy.get("input#serviceDiscipline").type("Radiographer")
      cy.get("input#serviceDiscipline").should("have.value", "Radiographer");

      cy.intercept("PUT", "http://localhost:8080/profession/1", "").as("updateProfession");
      cy.get("button[aria-label='Close']").click();
      cy.get("button[aria-label='Close']").should("not.exist");
      cy.get("button").contains("Save Changes?").click();

      cy.url().should("include", "/professions")
      cy.get("@updateProfession").its("request.body")
        .should("deep.equal", { _id: 1, observedOccupation: "Clinic", serviceDiscipline: "Radiographer" });
    })
    it("Delete the profession", () => {
      cy.intercept("DELETE", "http://localhost:8080/profession/1", (req) => {
        req.on("response", (res) => { res.setDelay(1000) }); //? Slow down the response to make it easier to track Alert's message
        req.reply("");
      }).as("deleteProfession");
      cy.get("button[aria-label='Close']").click();
      cy.get("button[aria-label='Close']").should("not.exist");
      cy.get("button").contains("Delete this Entry?").click();
      cy.contains("Attempting to delete this profession data"); //* An alert is rendered tracking DELETE progress

      cy.url().should("include", "/professions")
      cy.get("@deleteProfession").its("request.body").should("deep.equal", "");
    })
  })

  context("Click Back button", () => {
    it("From 'Add Professions' Page returns to 'Professions' List Page", () => {
      cy.get("button").contains("Add Profession").click();
  
      cy.url().should("include", "/professions/add");
      cy.get("h2").contains("Add New Profession");
  
      cy.get("button").contains("Go Back").click();
  
      cy.url().should("include", "/professions");
    })
    it("From 'Profession Detail' Page returns to 'Professions' List Page", () => {
      cy.intercept("GET", "http://localhost:8080/profession/1", { _id: 1, observedOccupation: "Clinic", serviceDiscipline: "Nurse" }).as("getProfession");
      cy.get("a").contains("Clinic Nurse").click();
  
      cy.url().should("include", "/profession/1");
      cy.get("h2").contains("Would you like to edit this Profession?: Clinic Nurse");
  
      cy.get("button").contains("Go Back").click();
  
      cy.url().should("include", "/professions");
    })
  })

  context("Profession Searchbar in Sidebar of App", () => {
    it("Render direct links to individual Professions when the search request finds matches and display a success message alert", () => {
      cy.intercept("GET", "http://localhost:8080/professions/?label=*",
        { body: [ { _id: "123", observedOccupation: "Clinic", serviceDiscipline: "Nurse" } ] }
      ).as('filteredList')
      cy.dataCy("searchBar").type("Nurse");
      cy.dataCy("searchBar").should("have.value", "Nurse");
  
      cy.get("button").contains("Clinic Nurse");
      cy.get("span").contains("Nurse"); //* Bolded ngb-highlight
  
      cy.contains("Found profession matching 'Nurse'").should("exist");
      cy.contains("Found profession matching 'Nurse'", { timeout: 5100 }).should("not.exist");
  
      cy.get("button").contains("Clinic Nurse").click();
      cy.url().should("include", "/profession/123")
      //? The detail page VERY BRIEFLY renders its defaults BUT cypress isn't fast enough for the following input get() queries to pass
      //? UNLESS I intercepted the request to "http://localhost:8080/profession/123", destroyed the response, and set a delay to the ensuing error response
      // cy.get("#observedOccupation").should("have.value", "Clinic");
      // cy.get("#serviceDiscipline").should("have.value", "Doctor");
      //? Cypress just catches the page's error messaging
      cy.get("h3").contains("Unable to retrieve the proper profession").should("exist");
      cy.contains("Getting profession info with id: 123 failed").should("exist");
      cy.contains("Getting profession info with id: 123 failed", { timeout: 5100 }).should("not.exist");
  
      cy.get("button").contains("Go Back").click();
    
      cy.url().should("include", "/professions");
    })
    it("Render error message when unable to find matching Profession from list", () => {
      cy.intercept("GET", "http://localhost:8080/professions/?label=*", { forceNetworkError: true }).as('err')
      cy.dataCy("searchBar").type("Bar"); //? Example of custom command usage which replace: `get("[data-cy='observedOccupation']")` calls
      cy.dataCy("searchBar").should("have.value", "Bar");
  
      cy.contains("Looking up the profession failed due to an unknown issue").should("exist");
      cy.contains("Looking up the profession failed due to an unknown issue", { timeout: 5100 }).should("not.exist");
    })
  })
})