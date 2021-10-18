describe('Login', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('dev_url') + 'en/auth/signin');
  });

  it('should show username and password input field', () => {
    cy.get('#auth-login-input-username').should('exist');
    cy.get('#auth-login-input-password').should('exist');
  });

  it('should fail on incorrect credentials', () => {
    cy.get('#auth-login-input-username').type('superuser');
    cy.get('#auth-login-input-password').type('superuserrrrr');
    cy.get('#auth-login-btn-submit').click();
  });

  it('should succeed on correct credentials', () => {
    cy.get('#auth-login-input-username').type('superuser');
    cy.get('#auth-login-input-password').type('superuser');
    cy.get('#auth-login-btn-submit').click();
  });

  it('should redirect to /en/auth/forgot-password', () => {
    cy.get('#auth-login-link-forgot-password')
      .should('have.attr', 'href')
      .and('eq', '/en/auth/forgot-password');
  });
});
