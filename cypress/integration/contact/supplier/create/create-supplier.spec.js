describe('Create Subcontractor', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check create supplier', () => {
    cy.get('.ml-2').click();
    cy.get('.pb-0 > .v-input').type('Agung');
    cy.get(':nth-child(2) > .v-input').type('08323713131');
    cy.get('.row > :nth-child(3) > .v-input').type('agung@gmail.com');
    cy.get(':nth-child(4) > .v-input').type('Jl Kalimantan');
    cy.get('.v-card__actions > .v-btn').click();
  });
});
