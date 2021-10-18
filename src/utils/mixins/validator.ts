import moment from 'moment';

export type ParamDiffDate = {
    from?: string;
    to?: string;
    measurement: 'years' | 'months' |'weeks'| 'hours' | 'minutes';
    diff: number;
    conditional: 'lessThan' | 'greaterThan' | 'lessThanEqual' | 'greaterThanEqual';
}

export const ValidatorMixins = {
  methods: {
    diffDate(payload: ParamDiffDate): boolean {
      let to = moment().format('DD MMMM YYYY');
      let from = moment().format('DD MMMM YYYY');

      if (payload.to !== undefined) {
        to = moment(payload.to).format('DD MMMM YYYY');
      }

      if (payload.from !== undefined) {
        from = moment(payload.from).format('DD MMMM YYYY');
      }

      switch (payload.conditional) {
        case 'lessThan':
          return moment(from).diff(to, payload.measurement) < payload.diff;
        case 'greaterThan':
          return moment(from).diff(to, payload.measurement) > payload.diff;
        case 'lessThanEqual':
          return moment(from).diff(to, payload.measurement) <= payload.diff;
        case 'greaterThanEqual':
          return moment(from).diff(to, payload.measurement) >= payload.diff;
        default:
          return moment(from).diff(to, payload.measurement) < payload.diff;
      }
    },
  },
};
