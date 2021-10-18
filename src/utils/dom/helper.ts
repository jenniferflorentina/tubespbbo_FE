/* eslint-disable no-param-reassign */
import Vue, { VueConstructor } from 'vue';

export const setTitle = (title) => {
  document.title = `Werkules - ${title}`;
};

export const currency = (value) => value
  .toFixed(0)
  .toString()
  .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

declare module 'vue/types/vue' {
  interface Vue {
    $setTitle: typeof setTitle;
    $currency: typeof currency;
  }
}

Vue.use((vue: VueConstructor) => {
  vue.prototype.$setTitle = setTitle;
  vue.prototype.$currency = currency;
});

export default {
  setTitle,
  currency,
};
