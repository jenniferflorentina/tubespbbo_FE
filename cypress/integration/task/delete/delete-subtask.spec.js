describe('Delete Sub Task', () => {
    before(() => {
      cy.login();
      cy.visit(Cypress.env('local_url')+'en/tasks');
    });
  
    it('Check delete task', () => {
      cy.get('.mdi-pencil').first().click();
      cy.get('.mdi-delete').first().click();
      cy.get('.v-card__actions > .v-btn').click();
    });
  });
  