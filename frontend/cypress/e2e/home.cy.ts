describe("home page", () => {
  it("loads the homepage with global navigation", () => {
    cy.visit("/");

    cy.contains("MovieDB").should("be.visible");
    cy.contains("Home").should("be.visible");
    cy.contains("Movies").should("be.visible");
    cy.get('input[placeholder="Search movies..."]').should("be.visible");
  });

  it("navigates to the movies page from the header", () => {
    cy.visit("/");

    cy.contains("Movies").click();

    cy.url().should("include", "/movies");
    cy.contains("Movie Library").should("be.visible");
  });

  it("shows the sign-in prompt when an unauthenticated user clicks Favorites", () => {
    cy.visit("/");

    cy.contains("Favorites").click();

    cy.url().should("not.include", "/favorites");
    cy.contains("Sign in required").should("be.visible");
  });

  it("implements movie carousel navigation", () => {
    cy.visit("/");

    cy.get('[data-slot="carousel"]').should("be.visible");
    cy.get('[data-slot="carousel-item"]').its("length").should("be.gte", 1);

    cy.contains("button", "Previous slide").should("be.disabled");
    cy.contains("button", "Next slide").then(($nextButton) => {
      if ($nextButton.is(":disabled")) {
        return;
      }

      cy.wrap($nextButton).click();
      cy.contains("button", "Previous slide").should("not.be.disabled");
    });
  });

  it("shows the popular movies section", () => {
    cy.visit("/");

    cy.contains("Popular Movies").should("be.visible");
  });
});
