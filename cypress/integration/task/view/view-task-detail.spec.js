import {evaluate_req,evaluate_contains} from '../../../utils'

describe('View Task detail', () => {
    before(() => {
      cy.login();
      cy.visit(Cypress.env('local_url')+'en/tasks');
    });

    it('Display Task details form', () => {
        cy.get('.mdi-pencil').first().click();
        const fields = [
          'Employee',
          'Construction Site Title',
          'Construction Site Address',
          'Task title',
          'Deadline',
          'Description',
          'Subtasks',
          'Important',
          'File attachment',
          'Other attachment',
          'Status',
        ];
    
        evaluate_contains(fields);
      });
      
      it('Required entered data must be not null', () => {
        const fields = [
          {
            name: ['#input-228','#input-232'],
            rules: {
              required: true,
            },
          },
        ];
    
        evaluate_req(fields);
      });
});