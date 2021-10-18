import VueMask from 'v-mask';
import Vue from 'vue';
import VueFeather from 'vue-feather';
import InstantSearch from 'vue-instantsearch';
import VueSkycons from 'vue-skycons';
import Vuebar from 'vuebar';
import DatetimePicker from 'vuetify-datetime-picker';
import App from './App.vue';
import i18n from './i18n';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import router from './router';
import store from './store';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";

Vue.config.productionTip = false;
Vue.use(VueMask);
Vue.use(VueFeather);
Vue.use(VueSkycons, {
  color: '#1e88e5',
});
Vue.use(InstantSearch);
Vue.use(Vuebar);
Vue.use(DatetimePicker);

// Configure language from route
router.beforeEach((to, from, next) => {
  // Get lang param from route
  let language = to.params.lang;

  // Check if null
  if (!language) {
    language = 'en';
  }

  // Set current language
  i18n.locale = language;
  next();
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
