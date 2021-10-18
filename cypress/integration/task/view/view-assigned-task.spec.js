describe('Show assigned task', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/tasks');
  });

  it('Check show assigned task ()', () => {
    cy.get('.v-slide-group__content > :nth-child(3)').click();
    cy.get('.mdi-pencil').first().click();
    //Check assign employee
    cy.get('.v-chip--select').should('exist')
  });
});
