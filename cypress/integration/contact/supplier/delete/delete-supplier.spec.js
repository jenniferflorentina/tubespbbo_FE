describe('Delete Supplier', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check cancel delete supplier', () => {
    cy.get('.mdi-delete').first().click();
    cy.get('.v-card__actions > .v-btn--text').click();
  });

  it('Check delete supplier', () => {
    cy.get('.mdi-delete').first().click();
    cy.get('.v-card__actions > .v-btn--is-elevated').click();
  });
});
