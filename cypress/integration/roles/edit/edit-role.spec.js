import { evaluate } from '../../../utils';

describe('Name on edit user must not be null', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/master-data/roles');
  });

  it('Check edit', () => {
    cy.get('.mdi-pencil').first().click();

    const fields = [
      {
        name: 'role-name-input',
        rules: {
          required: true,
          equals: 'CEO',
        },
      },
    ];

    evaluate(fields);
  });
});
