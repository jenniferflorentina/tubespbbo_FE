import {evaluate_contains } from '../../../../utils';

describe('Payment Terms tabs opened & Entered data displayed', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check Payment Terms tabs', () => {
    cy.get('.mdi-pencil').first().click();
    cy.contains('Payment Terms').click();
  });

  it('Display Contact Details form', () => {
    const fields = [
      'Currency',
      'Payment Method',
      'Time Payment',
      'Special Condition',
      'Bank',
      'IBAN',
      'BIC',
      'Tax Number',
      'Comment',
    ];

    evaluate_contains(fields);
  });
});
