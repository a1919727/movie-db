describe("movies page", () => {
  it("loads the movie library page", () => {
    cy.visit("/movies");

    cy.contains("Movie Library").should("be.visible");
  });

  it("shows movie filter controls", () => {
    cy.visit("/movies");

    cy.contains("button", "All Genre").should("be.visible");
    cy.contains("button", "All Year").should("be.visible");
    cy.contains("button", "All Ratings").should("be.visible");
  });

  it("shows the sign-in prompt when an unauthenticated user clicks a movie card", () => {
    cy.visit("/movies");

    cy.get('a[href^="/movies/"]').first().click();

    cy.url().should("include", "/movies");
    cy.url().should("not.match", /\/movies\/\d+$/);
    cy.contains("Sign in required").should("be.visible");
  });
});
