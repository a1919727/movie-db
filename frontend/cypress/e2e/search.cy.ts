describe("search page", () => {
  it("searchs a movie from the search bar", () => {
    cy.visit("/");

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
