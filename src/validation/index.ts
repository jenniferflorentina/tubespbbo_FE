import i18n from '@/i18n';

export default {
  required: (fieldName) => (v) => !!v || `${fieldName} ${i18n.t('validation.required')}`,
  isValidEmail: () => ((v) => {
    if (v) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(v).toLowerCase());
    }
    return true;
  }) || `E-mail ${i18n.t('validation.notValid')}`,
  minLength: (fieldName, min) => (v) => v?.length >= min || `${fieldName} ${i18n.t('validation.moreThan')} ${min} ${i18n.t('validation.characters')}`,
  maxLength: (fieldName, max) => (v) => {
    if (!v) return true;
    return v.length <= max || `${fieldName} ${i18n.t('validation.moreThan')} ${max} ${i18n.t('validation.characters')}`;
  },
  confirmPassword: (password) => (v) => v === password || `Password ${i18n.t('validation.doesNotMatch')}!`,
  phoneNumber: () => (v) => {
    if (!v) return true;
    return /^-?[\d.]+(?:e-?\d+)?$/.test(v) || `${i18n.t('validation.notPhoneFormat')}`;
  },
  isNumber: () => (v) => {
    if (!v) return true;
    return /^[0-9]*$/.test(v) || `${i18n.t('validation.notNumber')}`;
  },
  isCurrency: () => (v) => {
    if (!v) return true;
    return /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(v) || `${i18n.t('validation.currency')}`;
  }
};
