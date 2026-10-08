describe("home page", () => {
  it("switches themes and remembers the selection after a reload", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("moviedb-theme", "dark");
      },
    });
    cy.get('[data-cy="theme-toggle"]').should("have.attr", "aria-pressed", "true").click();
    cy.get("html").should("not.have.class", "dark");
    cy.get('[data-cy="theme-toggle"]').should("have.attr", "aria-pressed", "false");
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
    cy.get('[data-cy="theme-toggle"]').should("have.attr", "aria-pressed", "false").click();
    cy.get("html").should("have.class", "dark");
    cy.get('[data-cy="theme-toggle"]').should("have.attr", "aria-pressed", "true");
  });

  it("loads the homepage with global navigation", () => {
    cy.visit("/");

    cy.contains("MovieDB").should("be.visible");
    cy.contains("Home").should("be.visible");
    cy.contains("Movies").should("be.visible");
    cy.get('button[aria-label="Open movie search"]').should("be.visible");
    cy.get('input[placeholder="Search movies..."]').should("not.exist");
  });

  it("navigates to the movies page from the header", () => {
    cy.visit("/");

    cy.contains("Movies").click();

    cy.url().should("include", "/movies");
    cy.contains("Movie Library").should("be.visible");
  });

  it("shows the sign-in prompt when an unauthenticated user clicks My Library", () => {
    cy.visit("/");

    cy.get('header nav').contains("My Library").click();

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
