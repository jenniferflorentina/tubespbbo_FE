import { evaluate_req,evaluate_contains } from '../../../../utils';

describe('Contact tabs opened & Entered data displayed', () => {
  before(() => {
    cy.login();
    cy.visit(Cypress.env('local_url')+'en/contact/suppliers');
  });

  it('Check Contact tabs', () => {
    cy.get('.mdi-pencil').first().click();
    cy.contains('Contacts');
  });

  it('Display Contacts tab Form', () => {
    const fields = [
      'Name',
      'Telephone',
      'Mobile Number',
      'Fax',
      'Website',
      'Email',
    ];

    evaluate_contains(fields);
  });

  it('Required entered data must be not null', () => {
    const fields = [
      {
        name: ['.pb-0 > .v-input', '.row > :nth-child(3) > .v-input', ':nth-child(6) > .v-input'],
        rules: {
          required: true,
        },
      },
    ];

    evaluate_req(fields);
  });
});
