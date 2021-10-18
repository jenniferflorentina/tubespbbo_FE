import { evaluate_req, evaluate_contains } from '../../../../utils';

describe('Contact Detail tabs opened & Entered data displayed', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check Contact Detail tabs', () => {
    cy.get('.mdi-pencil').first().click();
    cy.contains('Contact Details').click();
  });

  it('Display Contact Details form', () => {
    const fields = [
      'Street Address',
      'Address Line 1',
      'Address Line 2',
      'Postal Code',
      'City',
      'Country',
    ];

    evaluate_contains(fields);
  });

  it('Required entered data must be not null', () => {
    const fields = [
      {
        name: ['.pb-0 > .v-input'],
        rules: {
          required: true,
        },
      },
    ];

    evaluate_req(fields);
  });
});
