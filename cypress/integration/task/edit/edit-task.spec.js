describe('Edit task', () => {
    before(() => {
      cy.login();
      cy.visit(Cypress.env('local_url')+'en/tasks');
    });
  
    it('Check edit', () => {
        cy.get('.mdi-pencil').first().click();
        cy.get(':nth-child(3) > .pb-0.col-lg-6 > .v-input').clear().type('test edit');
        cy.get('.ProseMirror > p').type('test description');
        cy.get(':nth-child(2) > .row > :nth-child(1) > .v-input').type('testing title');
        cy.get('.v-card__actions > .v-btn').click();
    });
  });
  