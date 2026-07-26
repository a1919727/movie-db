import { setupClerkTestingToken } from "@clerk/testing/cypress";

describe("auth page", () => {
  it("loads the signup page", () => {
    cy.visit("/signup");
    cy.contains("Create an account").should("be.visible");
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Sign up").should("be.visible");
  });

  it("signs up with a Clerk test account", () => {
    setupClerkTestingToken();
    cy.env(["USER_EMAIL", "USER_PASSWORD"]).then(
      ({ USER_EMAIL, USER_PASSWORD }) => {
        cy.visit("/signup");
        cy.clerkLoaded();

        cy.contains("Create an account").should("be.visible");
        cy.get('input[name="name"]').type("Cypress Test User");
        cy.get('input[name="email"]').type(USER_EMAIL);
        cy.get('input[name="password"]').type(USER_PASSWORD, {
          log: false,
        });
        cy.get('input[type="password"]').should(
          "have.value",
          "testmovieai@1123",
        );
        cy.contains("button", "Sign up").click();
        cy.contains("Verify your email").should("be.visible");
        cy.get('input[name="verificationCode"]').type("424242");
        cy.contains("button", "Verify email").click();
      },
    );
    cy.location("pathname").should("eq", "/");
    cy.get('[data-testid="user-menu-trigger"]', { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get("header").contains("Sign in").should("not.exist");
  });

  it("loads the login page", () => {
    cy.visit("/login");
    cy.contains("Welcome back").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Login").should("be.visible");
  });

  it("signs in with a Clerk test account", () => {
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
  });

  it("logs out", () => {
    cy.env(["USER_EMAIL", "USER_PASSWORD"]).then(
      ({ USER_EMAIL, USER_PASSWORD }) => {
        cy.visit("/login");
        cy.clerkLoaded();

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

    cy.get('[data-testid="user-menu-trigger"]').click();
    cy.get('[data-testid="logout-menu-item"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/");
    cy.get("header").contains("Sign in").should("be.visible");
  });
});
