describe('Assign task to multiple employee', () => {
    before(() => {
      cy.login();
      cy.visit(Cypress.env('local_url')+'en/tasks');
    });
  
    it('Assign Employee ()', () => {
      cy.contains('Not Assigned').click();
      cy.get('tbody > :nth-child(1) > .text-start > .v-data-table__checkbox > .v-icon').click();
      cy.get('.d-flex > .theme--dark').click();
      cy.get('.v-form > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections').click();

      //Multiple Employee
      cy.contains('kevin').click();
      cy.contains('Hanjaya').click();
      
      cy.get(':nth-child(4) > .v-input__icon > .v-icon').click()
      cy.get('.v-card__actions > .v-btn').click()
    });
  });
  