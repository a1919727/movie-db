describe("search page", () => {
  it("keeps the expanded search clear of desktop navigation", () => {
    cy.viewport(1280, 800);
    cy.visit("/");
    cy.get('button[aria-label="Open movie search"]').click();
    [1024, 1280, 1440].forEach((width) => {
      cy.viewport(width, 800);
      cy.get('header nav').then(($nav) => {
        cy.get('form[aria-label="Movie search"]').should(($form) => {
          const nav = $nav[0].getBoundingClientRect();
          const form = $form[0].getBoundingClientRect();
          expect(form.left).to.be.at.least(nav.right);
          expect(form.width).to.be.at.most(288);
        });
      });
    });
  });

  it("expands the search, focuses the input and closes with Escape", () => {
    cy.visit("/");
    cy.get('button[aria-label="Open movie search"]').click();
    cy.get('button[aria-label="Open movie search"]').should("not.be.visible");
    cy.get('input[placeholder="Search movies..."]').should("be.focused").type("batman{esc}");
    cy.get('button[aria-label="Open movie search"]')
      .should("have.attr", "aria-expanded", "false")
      .and("be.focused");
    cy.get('input[placeholder="Search movies..."]').should("not.exist");
    cy.get('button[aria-label="Open movie search"]').click();
    cy.get('input[placeholder="Search movies..."]').should("have.value", "batman");
    cy.get('form[aria-label="Movie search"] button[type="button"]').click();
    cy.get('input[placeholder="Search movies..."]').should("not.exist");
    cy.get('button[aria-label="Open movie search"]').should("be.focused").click();
    cy.get("header").click("topLeft");
    cy.get('input[placeholder="Search movies..."]').should("not.exist");
  });

  it("searchs a movie from the search bar", () => {
    cy.visit("/");

    cy.get('button[aria-label="Open movie search"]').click();
    cy.get('input[placeholder="Search movies..."]').type("batman");
    cy.get("form").first().submit();

    cy.url().should("include", "/search");
    cy.url().should("include", "query=batman");
    cy.contains("Search Result").should("be.visible");
  });

  it("shows the empty search state", () => {
    cy.visit("/search");

    cy.contains("Search Result").should("be.visible");
    cy.contains("Enter a movie title in the search bar to see results.").should(
      "be.visible",
    );
  });
});
