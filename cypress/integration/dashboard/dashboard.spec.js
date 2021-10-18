describe('Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(Cypress.env('local_url') + 'en');
  });

  it('should logout', () => {});
});
