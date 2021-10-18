import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from 'vuetify/src/locale/en';
import de from 'vuetify/src/locale/de';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });

  // Add vuetify translations
  messages['en']['$vuetify'] = {}; // eslint-disable-line dot-notation
  messages['de']['$vuetify'] = {}; // eslint-disable-line dot-notation
  Object.keys(de).forEach((key) => {
    messages['en']['$vuetify'][key] = en[key]; // eslint-disable-line dot-notation
    messages['de']['$vuetify'][key] = de[key]; // eslint-disable-line dot-notation
  });

  return messages;
}

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
