describe('Signout', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(Cypress.env('local_url') + 'en/');
  });

  it('should redirect to /en/auth/home-page', () => {
    cy.get('#header-icon').click();
  });
});
