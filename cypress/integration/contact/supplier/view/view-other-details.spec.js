import { evaluate_contains } from '../../../../utils';

describe('Other detail tabs opened & Entered data displayed', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check Other details tabs', () => {
    cy.get('.mdi-pencil').first().click();
    cy.contains('Other Details').click();
  });

  it('Display Other Details form', () => {
    cy.get('.mb-2 > .v-btn').should('exist');

    //Checking form
    const fields = ['Documents', "Other file's link", 'Comment'];
    evaluate_contains(fields);
  });
});
