import { required } from 'vuelidate/lib/validators';

export const evaluate = (arr) => {
  arr.forEach(({ name, rules }) => {
    cy.get(`[data-cy=${name}]`)
      .invoke('val')
      .then((val) => {
        if (rules.required) {
          !expect(val).to.be.not.null;
        }
        if (rules.equals) {
          !expect(val).equals(rules.equals);
        }
      });
  });
};

export const evaluate_req = (arr) => {
  arr.forEach(({ name, rules }) => {
    name.forEach((name) => {
      cy.get(`${name}`)
      .invoke('val')
      .then((val) => {
        if (rules.required) {
          !expect(val).to.be.not.null;
        }
        if (rules.required == false) {
          !expect(val).to.be.equals('');
        }
        if (rules.equals) {
          !expect(val).equals(rules.equals);
        }
      });
    });
  });
};

export const evaluate_contains = (arr) => {
  arr.forEach((name) => {
    cy.contains(name);
  });
};
