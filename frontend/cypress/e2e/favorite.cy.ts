describe("favorite page", () => {
  it("shows the favorites page for a signed-in user", () => {
    cy.env(["USER_EMAIL", "USER_PASSWORD"]).then(
      ({ USER_EMAIL, USER_PASSWORD }) => {
        cy.visit("/login");
        cy.clerkLoaded();

        cy.contains("Welcome back").should("be.visible");
        cy.get('input[name="email"]').type(USER_EMAIL);
        cy.get('input[name="password"]').type(USER_PASSWORD, {
          log: false,
        });

        cy.contains("button", "Login").click();
      },
    );

    cy.location("pathname").should("eq", "/");
    cy.get('[data-testid="user-menu-trigger"]', { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get("header").contains("Sign in").should("not.exist");

    cy.visit("/favorites");

    cy.location("pathname").should("eq", "/favorites");
    cy.contains("Favorites").should("be.visible");
  });
});
