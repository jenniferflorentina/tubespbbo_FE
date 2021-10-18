describe('Login', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('local_url') + 'en/auth/signin');
    cy.login();
  });

  it('Enters login page', () => {
    cy.contains('Email');
  });
});
