describe('Create task', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/tasks');
  });

  it('Check create task', () => {
    cy.get(
      '.col-lg-4 > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon'
    ).click();
    cy.get('#list-27').contains('Construction').click();
    cy.get('.ml-2').click();

    cy.get(':nth-child(4) > .v-input__icon > .v-icon').click();
    cy.get('.v-list-item__action > .v-simple-checkbox > .v-icon')
      .first()
      .click();
    cy.get(':nth-child(3) > .pb-0.col-lg-6 > .v-input').type(
      'testing title task'
    );
    cy.get('.py-0.col-lg-6 > .v-input').click();
    cy.get('tbody > :nth-child(2) > :nth-child(3) > .v-btn').click();
    cy.get('.tiptap-vuetify-editor__paragraph--is-empty').type(
      'automated test'
    );
    cy.get(':nth-child(2) > .row > :nth-child(1) > .v-input').type(
      'automated testing'
    );
    cy.get(
      ':nth-child(4) > .py-0 > .v-input > .v-input__control > .v-input__slot'
    ).click();
    cy.get('.v-card__actions > .v-btn').click();
  });
});
