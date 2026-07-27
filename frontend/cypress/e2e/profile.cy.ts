describe("profile page", () => {
  it("shows profile content for a signed-in user", () => {
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
    cy.get('[data-testid="user-menu-trigger"]').click();
    cy.get('[data-testid="profile-menu-item"]').should("be.visible").click();
    cy.contains("Loading...").should("not.exist");
    cy.contains("User not found.").should("not.exist");
    cy.contains("Edit profile").should("be.visible");
    cy.contains("Watch").should("be.visible");
    cy.contains("Review").should("be.visible");
    cy.contains("Favorites").should("be.visible");
  });

  it("shows error for the unauthenticated user", () => {
    cy.visit("/profile");
    cy.contains("Loading...").should("not.exist");
    cy.contains("User not found.").should("be.visible");
  });

  it("shows edit profile page", () => {
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
    cy.get('[data-testid="user-menu-trigger"]').click();
    cy.get('[data-testid="profile-menu-item"]').should("be.visible").click();
    cy.contains("Loading...").should("not.exist");
    cy.contains("User not found.").should("not.exist");
    cy.contains("Edit profile").should("be.visible").click();
    cy.location("pathname").should("eq", "/profile/edit");
    cy.contains("Edit Profile").should("be.visible");
    cy.contains("button", "Upload Avatar").should("be.visible");
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.contains("button", "Save Changes").should("be.visible");
    cy.contains("a", "Cancel").should("be.visible");
  });

  it("save changes successfully", () => {
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
    cy.get('[data-testid="user-menu-trigger"]').click();
    cy.get('[data-testid="profile-menu-item"]').should("be.visible").click();
    cy.contains("Loading...").should("not.exist");
    cy.contains("User not found.").should("not.exist");
    cy.contains("Edit profile").should("be.visible").click();
    cy.location("pathname").should("eq", "/profile/edit");
    cy.contains("Edit Profile").should("be.visible");
    const updatedName = `Cypress User ${Date.now()}`;
    cy.get('input[name="name"]').clear().type(updatedName);
    cy.contains("button", "Save Changes").click();
    cy.location("pathname").should("eq", "/profile");
    cy.contains("Profile updated.").should("be.visible");
    cy.contains(updatedName).should("be.visible");
  });

  it("cancel successfully", () => {
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
    cy.get('[data-testid="user-menu-trigger"]').click();
    cy.get('[data-testid="profile-menu-item"]').should("be.visible").click();
    cy.contains("Loading...").should("not.exist");
    cy.contains("User not found.").should("not.exist");
    cy.contains("button", "Edit profile").click();
    cy.location("pathname").should("eq", "/profile/edit");
    cy.contains("Edit Profile").should("be.visible");

    cy.get('input[name="name"]').clear().type("Temporary Name");
    cy.contains("a", "Cancel").click();
    cy.location("pathname").should("eq", "/profile");
  });
});
