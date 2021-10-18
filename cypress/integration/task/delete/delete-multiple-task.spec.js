describe('Delete Multiple Task', () => {
    before(() => {
      cy.login();
      cy.visit(Cypress.env('local_url')+'en/tasks');
    });
  
    it('Check delete task', () => {
      cy.get('tbody > :nth-child(1) > .text-start > .v-data-table__checkbox > .v-icon').click();
      cy.get(':nth-child(2) > .text-start > .v-data-table__checkbox > .v-icon').click()
      cy.get('.ml-2').click();
      cy.get('.v-card__actions > .v-btn--is-elevated').click();
    });
  });
  